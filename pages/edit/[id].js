// pages/edit/[id].js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import PageTransition from '../../components/PageTransition';
import { FaSpinner, FaUser, FaClipboard, FaMapMarkerAlt, FaUserTie, FaCalendarAlt, FaHourglassEnd } from 'react-icons/fa';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { motion } from 'framer-motion';

const EditLeave = () => {
  const router = useRouter();
  const { id } = router.query;
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const startTime = watch('start_time');
  const expectedReturnTime = watch('expected_return_time');

  useEffect(() => {
    if (id) {
      fetchLeave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchLeave = async () => {
    try {
      const res = await axiosInstance.get(`/api/leave_requests/${id}`);
      const data = res.data;
      setValue('name', data.name);
      setValue('leave_type', data.leave_type);
      setValue('destination', data.destination);
      setValue('approver', data.approver);
      // 处理时间格式，去掉秒和时区信息
      setValue('start_time', data.start_time.substring(0, 16));
      setValue('expected_return_time', data.expected_return_time.substring(0, 16));
    } catch (error) {
      console.error('Error fetching leave request:', error);
      toast.error('获取请假信息失败');
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    // 转换时间为ISO格式
    data.start_time = new Date(data.start_time).toISOString();
    data.expected_return_time = new Date(data.expected_return_time).toISOString();
    // 添加user_id，假设为1，需要根据实际情况获取
    data.user_id = 1;

    try {
      await axiosInstance.put(`/api/leave_requests/${id}`, data);
      toast.success('请假信息更新成功');
      router.push('/overview');
    } catch (error) {
      console.error('Error updating leave request:', error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('更新失败，请重试');
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
                    {...register('name', { 
                      required: '姓名是必填项',
                      minLength: { value: 2, message: '姓名至少2个字符' },
                      maxLength: { value: 20, message: '姓名不能超过20个字符' },
                      pattern: { value: /^[\u4e00-\u9fa5·]+$/, message: '姓名只能包含中文字符' }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-100 ${
                      errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                    placeholder="请输入您的姓名"
                    readOnly
                  />
                </FormField>

                {/* 请假事由 */}
                <FormField label="请假事由" icon={FaClipboard} error={errors.leave_type}>
                  <input
                    type="text"
                    {...register('leave_type', { 
                      required: '请假事由是必填项',
                      minLength: { value: 2, message: '请假事由至少2个字符' },
                      maxLength: { value: 50, message: '请假事由不能超过50个字符' }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.leave_type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                    placeholder="例如：病假、见导师等"
                  />
                </FormField>

                {/* 请假去向 */}
                <FormField label="请假去向" icon={FaMapMarkerAlt} error={errors.destination}>
                  <input
                    type="text"
                    {...register('destination', { 
                      required: '请假去向是必填项',
                      minLength: { value: 2, message: '请假去向至少2个字符' },
                      maxLength: { value: 50, message: '请假去向不能超过50个字符' }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.destination ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                    placeholder="例如：医院、学院等"
                  />
                </FormField>

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
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-100 ${
                      errors.start_time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                    readOnly
                  />
                </FormField>

                {/* 预计返回时间 */}
                <FormField label="预计返回时间" icon={FaHourglassEnd} error={errors.expected_return_time}>
                  <input
                    type="datetime-local"
                    {...register('expected_return_time', { 
                      required: '预计返回时间是必填项',
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

export default EditLeave;