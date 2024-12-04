// pages/leave_request.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';
import {
  FaSpinner,
  FaClipboard,
  FaMapMarkerAlt,
  FaUserTie,
  FaCalendarAlt,
  FaHourglassEnd
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const LeaveRequestContent = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset, watch, setError, clearErrors, setValue } = useForm();
  const [loading, setLoading] = useState(false);

  const [approvers, setApprovers] = useState([]);
  const [loadingApprovers, setLoadingApprovers] = useState(false);

  // 是否有未销假记录
  const [hasPendingLeave, setHasPendingLeave] = useState(false);

  const startTime = watch('start_time');
  const destinationType = watch('destination_type');

  useEffect(() => {
    if (destinationType === '一号院') {
      setValue('destination', '一号院');
    } else if (destinationType === '921医院') {
      setValue('destination', '921医院');
    } else {
      setValue('destination', '');
    }
  }, [destinationType, setValue]);

  useEffect(() => {
    if (user) {
      checkPendingLeave(user.id);
    }
  }, [user]);

  // 获取审批人列表
  useEffect(() => {
    const fetchApprovers = async () => {
      if (!user?.major) return;

      setLoadingApprovers(true);
      try {
        const response = await axiosInstance.get(`/approvers`, {
          params: { major: user.major }
        });
        // 将字符串数组转换为对象数组
        const formattedApprovers = response.data.map(name => ({
          id: name,  // 使用名字作为id
          name: name
        }));
        setApprovers(formattedApprovers);
      } catch (error) {
        console.error('获取审批人列表失败:', error);
        toast.error('获取审批人列表失败');
      } finally {
        setLoadingApprovers(false);
      }
    };

    fetchApprovers();
  }, [user?.major]);

  const checkPendingLeave = async (userId) => {
    try {
      const res = await axiosInstance.get('/leave_requests', {
        params: {
          user_id: userId,
          is_cancelled: 'false',
        },
      });
      if (res.data.total > 0) {
        setHasPendingLeave(true);
        toast.error('您有未销假的请假记录，无法提交新的请假申请。');
      } else {
        setHasPendingLeave(false);
      }
    } catch (error) {
      console.error('Error checking pending leave:', error);
      toast.error('无法验证您的请假状态，请稍后再试。');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    data.start_time = new Date(data.start_time).toISOString();
    data.expected_return_time = new Date(data.expected_return_time).toISOString();

    if (destinationType === '一号院' || destinationType === '921医院') {
      data.destination = destinationType;
    }

    try {
      await axiosInstance.post('/leave_requests', data);
      toast.success('请假申请提交成功');
      reset();
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error(error.response?.data?.error || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              请假信息填报
            </h1>
            {hasPendingLeave ? (
              <div className="text-center text-red-700 px-4 py-3 relative" role="alert">
                <span className="block sm:inline">
                  您有未销假的请假记录，无法提交新的请假申请。
                </span>
              </div>
            ) :
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 表单字段 */}
                {/* 请假事由 */}
                <FormField label="请假事由" icon={FaClipboard} error={errors.leave_type}>
                  <input
                    type="text"
                    {...register('leave_type', {
                      required: '请输入请假事由',
                      minLength: { value: 2, message: '请假事由至少2个字符' },
                      maxLength: { value: 50, message: '请假事由不能超过50个字符' }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.leave_type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:border-transparent focus:outline-none focus:ring-2`}
                    placeholder="例如：病假、见导师等"
                  />
                </FormField>

                {/* 请假去向类型 */}
                <FormField label="请假去向类型" icon={FaMapMarkerAlt} error={errors.destination_type}>
                  <select
                    {...register('destination_type', { required: '请选择请假去向类型' })}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${errors.destination_type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:border-transparent focus:outline-none focus:ring-2`}
                  >
                    <option value="">请选择</option>
                    <option value="三号院内">三号院内</option>
                    <option value="一号院">一号院</option>
                    <option value="921医院">921医院</option>
                    <option value="其他">其他</option>
                  </select>
                </FormField>

                {/* 动态请假去向 */}
                {(destinationType === '三号院内' || destinationType === '其他') && (
                  <FormField label="请假去向" icon={FaMapMarkerAlt} error={errors.destination}>
                    <input
                      type="text"
                      {...register('destination', {
                        required: '请输入请假去向',
                        minLength: { value: 2, message: '请假去向至少2个字符' },
                        maxLength: { value: 50, message: '请假去向不能超过50个字符' }
                      })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.destination ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                      placeholder="例如：医院、学院等"
                    />
                  </FormField>
                )}

                {/* 批假人 */}
                <FormField label="批假人" icon={FaUserTie} error={errors.approver}>
                  <select
                    {...register('approver', { required: '请选择批假人' })}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${errors.approver
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                      } focus:border-transparent focus:outline-none focus:ring-2`}
                    disabled={loadingApprovers}
                  >
                    <option value="">
                      {loadingApprovers ? '加载中...' : '请选择批假人'}
                    </option>
                    {approvers.map(approver => (
                      <option key={approver.id} value={approver.name}>
                        {approver.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* 时间字段 */}
                <FormField label="出发时间" icon={FaCalendarAlt} error={errors.start_time}>
                  <input
                    type="datetime-local"
                    {...register('start_time', {
                      required: '请选择出发时间',
                      validate: value => {
                        const now = new Date();
                        const selectedTime = new Date(value);
                        if (selectedTime < now) {
                          return '出发时间不能早于当前时间';
                        }
                        return true;
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.start_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:border-transparent focus:outline-none focus:ring-2`}
                  />
                </FormField>

                <FormField label="预计返回时间" icon={FaHourglassEnd} error={errors.expected_return_time}>
                  <input
                    type="datetime-local"
                    {...register('expected_return_time', {
                      required: '请选择预计返回时间',
                      validate: value => {
                        if (!startTime) return '请先选择出发时间';
                        return new Date(value) > new Date(startTime) || '预计返回时间必须晚于出发时间';
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.expected_return_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:border-transparent focus:outline-none focus:ring-2`}
                  />
                </FormField>

                {errors.submit && (
                  <p className="text-red-500 text-center">{errors.submit.message}</p>
                )}

                {/* 按钮组 */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="submit" disabled={loading || errors.submit} variant="primary">
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        提交中...
                      </>
                    ) : '提交信息'}
                  </Button>
                  <Button type="button" onClick={() => reset()} variant="secondary">
                    重置表单
                  </Button>
                </div>
              </form>
            }
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};


export default function LeaveRequestPage() {
  return (
    <ProtectedRoute>
      <LeaveRequestContent />
    </ProtectedRoute>
  );
}