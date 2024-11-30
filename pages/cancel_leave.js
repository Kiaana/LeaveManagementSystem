// pages/cancel_leave.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';
import { FaSpinner, FaCalendarAlt, FaClipboard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const CancelLeaveContent = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [loadingLeave, setLoadingLeave] = useState(true);
  const [pendingLeave, setPendingLeave] = useState(null);

  useEffect(() => {
    const fetchPendingLeave = async () => {
      if (!user) return;

      try {
        const res = await axiosInstance.get('/leave_requests', {
          params: {
            is_cancelled: 'false',
          },
        });
        if (res.data.total === 0) {
          toast.error('您目前没有未销假的请假记录，无需销假。');
          setPendingLeave(null);
        } else {
          const leave = res.data.data[0];

          const startTime = new Date(leave.start_time);
          const expectedReturnTime = new Date(leave.expected_return_time);

          const localStartTime = new Date(startTime.getTime() - startTime.getTimezoneOffset() * 60000);
          const localExpectedReturnTime = new Date(expectedReturnTime.getTime() - expectedReturnTime.getTimezoneOffset() * 60000);

          const formatLocalTime = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
          };

          leave.formatted_start_time = formatLocalTime(localStartTime);
          leave.formatted_expected_return_time = formatLocalTime(localExpectedReturnTime);

          setPendingLeave(leave);
        }
      } catch (error) {
        console.error('Error fetching pending leave:', error);
        toast.error('无法获取您的请假信息，请稍后再试。');
      } finally {
        setLoadingLeave(false);
      }
    };

    fetchPendingLeave();
  }, [user]);

  const onSubmit = async (data) => {
    if (!pendingLeave) {
      setError('submit', { type: 'manual', message: '没有未销假记录' });
      return;
    }
    setLoading(true);
    // data.actual_return_time = new Date(data.actual_return_time).toISOString();
    // 销假时间为当前时间
    data.actual_return_time = new Date().toISOString();

    try {
      await axiosInstance.post('/cancel_leave', data);
      toast.success('销假成功');
      reset();
      setPendingLeave(null);
    } catch (error) {
      console.error('Error submitting cancellation:', error);
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
              销假信息填报
            </h1>

            {loadingLeave ? (
              <div className="flex justify-center">
                <FaSpinner className="animate-spin text-gray-500 text-3xl" />
              </div>
            ) : pendingLeave ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">待销假记录</h2>
                  <p className="text-gray-600">
                    请假类型: <span className="font-medium">{pendingLeave.leave_type}</span>
                  </p>
                  <p className="text-gray-600">
                    请假去向: <span className="font-medium">{pendingLeave.destination}</span>
                  </p>
                  <p className="text-gray-600">
                    请假时间: {pendingLeave.formatted_start_time} 至 {pendingLeave.formatted_expected_return_time}
                  </p>
                </div>

                <FormField label="销假方式" icon={FaClipboard} error={errors.cancellation_method}>
                  <select
                    {...register('cancellation_method', {
                      required: '请选择销假方式'
                    })}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${errors.cancellation_method ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:border-transparent focus:outline-none focus:ring-2`}
                  >
                    <option value="">请选择销假方式</option>
                    <option value="当面销假">当面销假</option>
                    <option value="微信销假">微信销假</option>
                  </select>
                </FormField>

                {/* <FormField label="实际返回时间" icon={FaCalendarAlt} error={errors.actual_return_time}>
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
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.actual_return_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:border-transparent focus:outline-none focus:ring-2`}
                  />
                </FormField> */}

                {errors.submit && (
                  <p className="text-red-500 text-center">{errors.submit.message}</p>
                )}

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="submit" disabled={loading || errors.submit} variant="primary">
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        提交中...
                      </>
                    ) : '提交销假'}
                  </Button>
                  <Button type="button" onClick={() => reset()} variant="secondary">
                    重置表单
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-center text-gray-600">您目前没有未销假的请假记录。</p>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default function CancelLeavePage() {
  return (
    <ProtectedRoute>
      <CancelLeaveContent />
    </ProtectedRoute>
  );
} 