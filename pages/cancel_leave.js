// pages/cancel_leave.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';
import { FaSpinner, FaUser, FaCalendarAlt, FaClipboard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import FormField from '../components/FormField';
import Button from '../components/Button';
import useUsers from '../hooks/useUsers'; // 引入自定义 Hook

const CancelLeave = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setError, clearErrors } = useForm();
  const [loading, setLoading] = useState(false);
  const { users, loadingUsers } = useUsers(); // 使用自定义 Hook
  const [userId, setUserId] = useState(null);
  const [pendingLeave, setPendingLeave] = useState(null);

  const name = watch('name');
  const actualReturnTime = watch('actual_return_time');

  useEffect(() => {
    if (name && users.length > 0) {
      validateUserName(name);
    } else {
      setUserId(null);
      setPendingLeave(null);
      clearErrors('submit');
    }
  }, [name, users]);

  const validateUserName = (enteredName) => {
    const matchedUser = users.find(user => user.name === enteredName.trim());
    if (matchedUser) {
      setUserId(matchedUser.id);
      clearErrors('name');
      fetchPendingLeave(matchedUser.id);
    } else {
      setUserId(null);
      setPendingLeave(null);
      setError('name', { type: 'manual', message: '该姓名未在系统中注册' });
    }
  };

  const fetchPendingLeave = async (userId) => {
    try {
      const res = await axiosInstance.get('/leave_requests', {
        params: {
          user_id: userId,
          is_cancelled: 'false',
        },
      });
      if (res.data.total === 0) {
        toast.error('您目前没有未销假的请假记录，无需销假。');
        setPendingLeave(null);
        setError('submit', { type: 'manual', message: '没有未销假记录' });
      } else {
        const leave = res.data.data[0];
        setPendingLeave(leave);
        clearErrors('submit');
      }
    } catch (error) {
      console.error('Error fetching pending leave:', error);
      toast.error('无法获取您的请假信息，请稍后再试。');
    }
  };

  const onSubmit = async (data) => {
    if (!userId) {
      setError('name', { type: 'manual', message: '请输入有效的姓名' });
      return;
    }
    if (!pendingLeave) {
      setError('submit', { type: 'manual', message: '没有未销假记录' });
      return;
    }
    setLoading(true);
    data.actual_return_time = new Date(data.actual_return_time).toISOString();
    data.user_id = userId;

    try {
      await axiosInstance.post('/cancel_leave', data);
      toast.success('销假成功');
      reset();
      setUserId(null);
      setPendingLeave(null);
    } catch (error) {
      console.error('Error submitting cancellation:', error);
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
      <div className="min-h-screen bg-white py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              销假信息填报
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

                {pendingLeave && (
                  <>
                    <FormField label="销假方式" icon={FaClipboard} error={errors.cancellation_method}>
                      <input
                        type="text"
                        {...register('cancellation_method', { 
                          required: '请输入销假方式',
                          minLength: { value: 2, message: '销假方式至少2个字符' },
                          maxLength: { value: 50, message: '销假方式不能超过50个字符' }
                        })}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.cancellation_method ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                        placeholder="例如：教导员处当面销假、微信销假等"
                      />
                    </FormField>

                    <FormField label="实际返回时间" icon={FaCalendarAlt} error={errors.actual_return_time}>
                      <input
                        type="datetime-local"
                        {...register('actual_return_time', { 
                          required: '请选择实际返回时间',
                          validate: value => {
                            const start = new Date(pendingLeave.start_time);
                            const selectedTime = new Date(value);
                            const now = new Date();
                            if (selectedTime < start) {
                              return '实际返回时间不能早于出发时间';
                            }
                            if (selectedTime > now) {
                              return '实际返回时间不能晚于当前时间';
                            }
                            return true;
                          }
                        })}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.actual_return_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                      />
                    </FormField>
                  </>
                )}

                {errors.submit && (
                  <p className="text-red-500 text-center">{errors.submit.message}</p>
                )}

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="submit" disabled={loading || errors.submit || !userId || !pendingLeave} variant="primary">
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
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CancelLeave;