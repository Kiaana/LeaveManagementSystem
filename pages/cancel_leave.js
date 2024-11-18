// pages/cancel_leave.js
import React, { useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';
import { FaSpinner, FaUser, FaCalendarAlt, FaClipboard } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FormField = ({ label, icon: Icon, error, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative"
  >
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      {children}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-xs mt-1"
      >
        {error.message}
      </motion.p>
    )}
  </motion.div>
);

const Button = ({ type, onClick, disabled, variant = 'primary', children }) => {
  const baseClasses = "flex items-center justify-center px-6 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

const CancelLeave = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
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