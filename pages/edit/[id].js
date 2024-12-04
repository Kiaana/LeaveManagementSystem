// pages/edit/[id].js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import PageTransition from '../../components/PageTransition';
import { 
  FaSpinner, 
  FaUser, 
  FaClipboard, 
  FaMapMarkerAlt, 
  FaUserTie, 
  FaCalendarAlt, 
  FaHourglassEnd 
} from 'react-icons/fa';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { formatDate } from '../../utils/dateFormatter';

const EditLeaveContent = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [leaveData, setLeaveData] = useState(null);
  const startTime = watch('start_time');
  const destinationType = watch('destination_type');

  useEffect(() => {
    const fetchLeave = async () => {
      if (!id || !user) return;
      
      try {
        const res = await axiosInstance.get(`/leave_requests/${id}`);
        const data = res.data;

        // 检查权限
        if (user.role !== 'superadmin' && data.user.id !== user.id) {
          toast.error('您无权编辑此请假记录');
          router.push('/overview');
          return;
        }

        setValue('name', data.user.name);
        setValue('leave_type', data.leave_type);
        setValue('approver', data.approver);
        setValue('start_time', formatDate(data.start_time, 'custom', 'YYYY-MM-DDTHH:mm'));
        setValue('expected_return_time', formatDate(data.expected_return_time, 'custom', 'YYYY-MM-DDTHH:mm'));

        // 设置 destination_type 和 destination
        if (data.destination_type) {
          setValue('destination_type', data.destination_type);
          if (data.destination_type === '其他' || data.destination_type === '三号院内') {
            setValue('destination', data.destination);
          }
        } else {
          if (data.destination === '一号院' || data.destination === '921医院') {
            setValue('destination_type', data.destination);
          } else if (data.destination === '三号院内') {
            setValue('destination_type', '三号院内');
            setValue('destination', data.destination);
          } else {
            setValue('destination_type', '其他');
            setValue('destination', data.destination);
          }
        }

        setLeaveData(data);
      } catch (error) {
        console.error('Error fetching leave request:', error);
        toast.error('获取请假信息失败');
        router.push('/overview');
      } finally {
        setFetching(false);
      }
    };

    fetchLeave();
  }, [id, user, router, setValue]);

  useEffect(() => {
    if (destinationType === '一号院') {
      setValue('destination', '一号院');
    } else if (destinationType === '921医院') {
      setValue('destination', '921医院');
    } else if (destinationType !== '其他' && destinationType !== '三号院内') {
      setValue('destination', '');
    }
  }, [destinationType, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    // 转换时间为 ISO 格式
    data.start_time = new Date(data.start_time).toISOString();
    data.expected_return_time = new Date(data.expected_return_time).toISOString();

    // 根据 destination_type 设置 destination
    if (data.destination_type === '一号院' || data.destination_type === '921医院') {
      data.destination = data.destination_type;
    }

    try {
      await axiosInstance.put(`/leave_requests/${id}`, data);
      toast.success('请假信息更新成功');
      router.push('/overview');
    } catch (error) {
      console.error('Error updating leave request:', error);
      toast.error('更新失败，请重试');
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
              编辑请假信息
            </h1>

            {fetching ? (
              <div className="flex justify-center">
                <FaSpinner className="animate-spin text-gray-500 text-3xl" />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 姓名 */}
                <FormField label="姓名" icon={FaUser} error={errors.name}>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none bg-gray-100"
                    placeholder="请输入您的姓名"
                    readOnly // 设置为只读
                  />
                </FormField>

                {/* 请假事由 */}
                <FormField label="请假事由" icon={FaClipboard} error={errors.leave_type}>
                  <input
                    type="text"
                    {...register('leave_type', { required: '请假事由是必填项' })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.leave_type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                    placeholder="例如：病假、见导师等"
                  />
                </FormField>

                {/* 请假去向类型 */}
                <FormField label="请假去向类型" icon={FaMapMarkerAlt} error={errors.destination_type}>
                  <select
                    {...register('destination_type', { required: '请选择请假去向类型' })}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                      errors.destination_type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                  >
                    <option value="">请选择</option>
                    <option value="三号院内">三号院内</option>
                    <option value="一号院">一号院</option>
                    <option value="921医院">921医院</option>
                    <option value="其他">其他</option>
                  </select>
                </FormField>

                {/* 动态显示请假去向 */}
                {(destinationType === '三号院内' || destinationType === '其他') && (
                  <FormField label="请假去向" icon={FaMapMarkerAlt} error={errors.destination}>
                    <input
                      type="text"
                      {...register('destination', { 
                        required: '请输入请假去向',
                        minLength: { value: 2, message: '请假去向至少2个字符' },
                        maxLength: { value: 50, message: '请假去向不能超过50个字符' }
                      })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                        errors.destination ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:border-transparent focus:outline-none focus:ring-2`}
                      placeholder="例如：医院、学院等"
                    />
                  </FormField>
                )}

                {/* 批假人 */}
                <FormField label="批假人" icon={FaUserTie} error={errors.approver}>
                  <input
                    type="text"
                    {...register('approver', { 
                      required: '批假人是必填项',
                      minLength: { value: 2, message: '批假人姓名至少2个字符' },
                      maxLength: { value: 20, message: '批假人姓名不能超过20个字符' },
                      pattern: { value: /^[\u4e00-\u9fa5·]+$/, message: '批假人姓名只能包含中文字符' }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.approver ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                    placeholder="请输入审批人员的姓名"
                  />
                </FormField>

                {/* 出发时间 */}
                <FormField label="出发时间" icon={FaCalendarAlt} error={errors.start_time}>
                  <input
                    type="datetime-local"
                    {...register('start_time', {
                      required: '出发时间是必填项',
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.start_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                  />
                </FormField>

                {/* 请假预计返回时间 */}
                <FormField label="预计返回时间" icon={FaHourglassEnd} error={errors.expected_return_time}>
                  <input
                    type="datetime-local"
                    {...register('expected_return_time', { 
                      required: '预计返回时间是必填项',
                      validate: value => !startTime || new Date(value) > new Date(startTime) || '返回时间必须晚于出发时间'
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.expected_return_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                  />
                </FormField>

                {errors.submit && (
                  <p className="text-red-500 text-center">{errors.submit.message}</p>
                )}

                {/* 提交按钮 */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="submit" disabled={loading} variant="primary">
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        更新中...
                      </>
                    ) : '更新信息'}
                  </Button>
                  <Button type="button" onClick={() => router.back()} variant="secondary">
                    取消
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default function EditLeavePage() {
  return (
    <ProtectedRoute>
      <EditLeaveContent />
    </ProtectedRoute>
  );
}