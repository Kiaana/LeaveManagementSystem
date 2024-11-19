// pages/leave_request.js
import React, { useState } from 'react';
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


const LeaveRequest = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);

  const startTime = watch('start_time');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post('/leave_requests', data);
      toast.success('请假申请提交成功');
      reset();
    } catch (error) {
      console.error('Error submitting leave request:', error);
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
              请假申请
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

              <FormField label="请假事由" icon={FaClipboard} error={errors.leave_type}>
                <input
                  type="text"
                  {...register('leave_type', { required: '请输入请假事由' })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.leave_type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:border-transparent focus:outline-none focus:ring-2`}
                  placeholder="例如：病假、见导师等"
                />
              </FormField>

              <FormField label="请假去向" icon={FaMapMarkerAlt} error={errors.destination}>
                <input
                  type="text"
                  {...register('destination', { required: '请输入请假去向' })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.destination ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:border-transparent focus:outline-none focus:ring-2`}
                  placeholder="例如：医院、学院等"
                />
              </FormField>

              <FormField label="批假人" icon={FaUserTie} error={errors.approver}>
                <input
                  type="text"
                  {...register('approver', { required: '请输入批假人' })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.approver ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:border-transparent focus:outline-none focus:ring-2`}
                  placeholder="请输入审批人员的姓名"
                />
              </FormField>

              <FormField label="出发时间" icon={FaCalendarAlt} error={errors.start_time}>
                <input
                  type="datetime-local"
                  {...register('start_time', { required: '请选择出发时间' })}
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
                    validate: value => !startTime || new Date(value) > new Date(startTime) || '返回时间必须晚于出发时间'
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.expected_return_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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

export default LeaveRequest;