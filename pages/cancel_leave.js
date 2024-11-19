// pages/cancel_leave.js
import React, { useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';
import { FaSpinner, FaUser, FaCalendarAlt, FaClipboard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import FormField from '../components/FormField';
import Button from '../components/Button';


const CancelLeave = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    // 将actual_return_time转换为ISO格式，并添加时区信息
    data.actual_return_time = new Date(data.actual_return_time).toISOString();
    try {
      await axiosInstance.post('/cancel_leave', data);
      toast.success('销假申请提交成功');
      reset();
    } catch (error) {
      console.error('Error submitting cancellation:', error);
      toast.error('提交失败，请重试');
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
              销假申请
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField label="姓名" icon={FaUser} error={errors.name}>
                <input
                  type="text"
                  {...register('name', { 
                    required: '请输入姓名',
                    minLength: { value: 2, message: '姓名至少2个字符' }
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:border-transparent focus:outline-none focus:ring-2`}
                  placeholder="请输入您的姓名"
                />
              </FormField>

              <FormField label="销假方式" icon={FaClipboard} error={errors.cancellation_method}>
                <input
                  type="text"
                  {...register('cancellation_method', { 
                    required: '请输入销假方式'
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.cancellation_method ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:border-transparent focus:outline-none focus:ring-2`}
                  placeholder="例如：当面销假、微信销假等"
                />
              </FormField>

              <FormField label="实际返回时间" icon={FaCalendarAlt} error={errors.actual_return_time}>
                <input
                  type="datetime-local"
                  {...register('actual_return_time', { 
                    required: '请选择实际返回时间'
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.actual_return_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:border-transparent focus:outline-none focus:ring-2`}
                />
              </FormField>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button type="submit" disabled={loading} variant="primary">
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
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CancelLeave;