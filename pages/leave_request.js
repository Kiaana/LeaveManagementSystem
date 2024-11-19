// pages/leave_request.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';
import { 
  FaSpinner, 
  FaUser, 
  FaClipboard, 
  FaMapMarkerAlt, 
  FaUserTie,
  FaCalendarAlt,
  FaHourglassEnd 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import FormField from '../components/FormField';
import Button from '../components/Button';
import useUsers from '../hooks/useUsers'; // 引入自定义 Hook

const LeaveRequest = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setError, clearErrors } = useForm();
  const [loading, setLoading] = useState(false);
  const { users, loadingUsers } = useUsers(); // 使用自定义 Hook
  const [userId, setUserId] = useState(null);
  const [nameValidated, setNameValidated] = useState(false);

  const name = watch('name');
  const startTime = watch('start_time');
  const expectedReturnTime = watch('expected_return_time');

  useEffect(() => {
    if (name && users.length > 0) {
      validateUserName(name);
    } else {
      setUserId(null);
      setNameValidated(false);
      clearErrors('submit');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, users]);

  const validateUserName = (enteredName) => {
    const matchedUser = users.find(user => user.name === enteredName.trim());
    if (matchedUser) {
      setUserId(matchedUser.id);
      setNameValidated(true);
      clearErrors('name');
      checkPendingLeave(matchedUser.id);
    } else {
      setUserId(null);
      setNameValidated(false);
      setError('name', { type: 'manual', message: '该姓名未在系统中注册' });
    }
  };

  const checkPendingLeave = async (userId) => {
    try {
      const res = await axiosInstance.get('/leave_requests', {
        params: {
          user_id: userId,
          is_cancelled: 'false',
        },
      });
      if (res.data.total > 0) {
        toast.error('您有未销假的请假记录，无法提交新的请假申请。');
        setError('submit', { type: 'manual', message: '有未销假记录' });
        setNameValidated(false);
      } else {
        clearErrors('submit');
        setNameValidated(true);
      }
    } catch (error) {
      console.error('Error checking pending leave:', error);
      toast.error('无法验证您的请假状态，请稍后再试。');
      setNameValidated(false);
    }
  };

  const onSubmit = async (data) => {
    if (!userId) {
      setError('name', { type: 'manual', message: '请输入有效的姓名' });
      return;
    }
    setLoading(true);
    data.start_time = new Date(data.start_time).toISOString();
    data.expected_return_time = new Date(data.expected_return_time).toISOString();
    data.user_id = userId;

    try {
      await axiosInstance.post('/leave_requests', data);
      toast.success('请假申请提交成功');
      reset();
      setUserId(null);
      setNameValidated(false);
    } catch (error) {
      console.error('Error submitting leave request:', error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('提交失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              请假申请
            </h1>

            {loadingUsers ? (
              <div className="flex justify-center">
                <FaSpinner className="animate-spin text-gray-500 text-3xl" />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField label="姓名" icon={FaUser} error={errors.name}>
                  <input
                    type="text"
                    {...register('name', { 
                      required: '请输入姓名',
                      minLength: { value: 2, message: '姓名至少2个字符' },
                      maxLength: { value: 20, message: '姓名不能超过20个字符' },
                      pattern: { value: /^[\u4e00-\u9fa5·]+$/, message: '姓名只能包含中文字符' }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                    placeholder="请输入您的姓名"
                  />
                </FormField>

                {nameValidated && (
                  <>
                    <FormField label="请假事由" icon={FaClipboard} error={errors.leave_type}>
                      <input
                        type="text"
                        {...register('leave_type', { 
                          required: '请输入请假事由',
                          minLength: { value: 2, message: '请假事由至少2个字符' },
                          maxLength: { value: 50, message: '请假事由不能超过50个字符' }
                        })}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.leave_type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                        placeholder="例如：病假、见导师等"
                      />
                    </FormField>

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

                    <FormField label="批假人" icon={FaUserTie} error={errors.approver}>
                      <input
                        type="text"
                        {...register('approver', { 
                          required: '请输入批假人',
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
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.start_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                      />
                    </FormField>

                    <FormField label="预计返回时间" icon={FaHourglassEnd} error={errors.expected_return_time}>
                      <input
                        type="datetime-local"
                        {...register('expected_return_time', { 
                          required: '请选择预计返回时间',
                          validate: value => {
                            if (!startTime) {
                              return '请先选择出发时间';
                            }
                            const start = new Date(startTime);
                            const end = new Date(value);
                            if (end <= start) {
                              return '预计返回时间必须晚于出发时间';
                            }
                            return true;
                          }
                        })}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.expected_return_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                      />
                    </FormField>
                  </>
                )}

                {errors.submit && (
                  <p className="text-red-500 text-center">{errors.submit.message}</p>
                )}

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="submit" disabled={loading || errors.submit || !nameValidated} variant="primary">
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        提交中...
                      </>
                    ) : '提交申请'}
                  </Button>
                  <Button type="button" onClick={() => reset()} variant="secondary">
                    重置表单
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

export default LeaveRequest;