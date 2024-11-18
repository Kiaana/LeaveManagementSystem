// pages/cancel_leave.js
import React, { useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';
import { FaSpinner } from 'react-icons/fa';

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
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">销假申请</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-4">
          {/* 姓名 */}
          <div>
            <label className="block mb-1 font-semibold">姓名<span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register('name', { required: '姓名是必填项' })}
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
              placeholder="请输入您的姓名"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* 销假方式 */}
          <div>
            <label className="block mb-1 font-semibold">销假方式<span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register('cancellation_method', { required: '销假方式是必填项' })}
              className={`w-full border ${errors.cancellation_method ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
              placeholder="例如：当面销假、微信销假等"
            />
            {errors.cancellation_method && <p className="text-red-500 text-sm mt-1">{errors.cancellation_method.message}</p>}
          </div>

          {/* 实际返回时间 */}
          <div>
            <label className="block mb-1 font-semibold">实际返回时间<span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              {...register('actual_return_time', { required: '实际返回时间是必填项' })}
              className={`w-full border ${errors.actual_return_time ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
            />
            {errors.actual_return_time && <p className="text-red-500 text-sm mt-1">{errors.actual_return_time.message}</p>}
          </div>

          {/* 提交按钮 */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className={`flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
              提交
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              onClick={() => reset()}
            >
              重置
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
};

export default CancelLeave;