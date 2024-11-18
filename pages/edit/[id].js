// pages/edit/[id].js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import PageTransition from '../../components/PageTransition';
import { FaSpinner } from 'react-icons/fa';

const EditLeave = () => {
  const router = useRouter();
  const { id } = router.query;
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLeave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchLeave = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/leave_requests/${id}`);
      const data = res.data;
      setValue('name', data.name);
      setValue('leave_type', data.leave_type);
      setValue('destination', data.destination);
      setValue('approver', data.approver);
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
    try {
      await axios.put(`http://127.0.0.1:5000/api/leave_requests/${id}`, data);
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
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">编辑请假信息</h1>
        {fetching ? (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-gray-500 text-3xl" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-4">
            {/* 姓名 */}
            <div>
              <label className="block mb-1 font-semibold">姓名</label>
              <input
                type="text"
                {...register('name', { required: '姓名是必填项' })}
                className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded p-2 bg-gray-100`}
                placeholder="请输入您的姓名"
                readOnly
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* 请假事由 */}
            <div>
              <label className="block mb-1 font-semibold">请假事由<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('leave_type', { required: '请假事由是必填项' })}
                className={`w-full border ${errors.leave_type ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
                placeholder="例如：病假、见导师等"
              />
              {errors.leave_type && <p className="text-red-500 text-sm mt-1">{errors.leave_type.message}</p>}
            </div>

            {/* 请假去向 */}
            <div>
              <label className="block mb-1 font-semibold">请假去向<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('destination', { required: '请假去向是必填项' })}
                className={`w-full border ${errors.destination ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
                placeholder="例如：医院、学院等"
              />
              {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>}
            </div>

            {/* 批假人 */}
            <div>
              <label className="block mb-1 font-semibold">批假人<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('approver', { required: '批假人是必填项' })}
                className={`w-full border ${errors.approver ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
                placeholder="请输入审批人员的姓名"
              />
              {errors.approver && <p className="text-red-500 text-sm mt-1">{errors.approver.message}</p>}
            </div>

            {/* 出发时间 */}
            <div>
              <label className="block mb-1 font-semibold">出发时间<span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                {...register('start_time', { required: '出发时间是必填项' })}
                className={`w-full border ${errors.start_time ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
              />
              {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>}
            </div>

            {/* 请假预计返回时间 */}
            <div>
              <label className="block mb-1 font-semibold">请假预计返回时间<span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                {...register('expected_return_time', { required: '预计返回时间是必填项' })}
                className={`w-full border ${errors.expected_return_time ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
              />
              {errors.expected_return_time && <p className="text-red-500 text-sm mt-1">{errors.expected_return_time.message}</p>}
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
                更新
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => router.back()}
              >
                取消
              </button>
            </div>
          </form>
        )}
      </div>
    </PageTransition>
  );
};

export default EditLeave;