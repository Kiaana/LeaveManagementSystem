// pages/duty_info.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';
import { 
  FaSpinner,
  FaUser,
  FaUserTie,
} from 'react-icons/fa';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const DutyInfo = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    trigger,
    reset
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 新增的用户验证函数
  const validateUserName = async (name) => {
    try {
      const response = await axiosInstance.get(`/is_user?name=${encodeURIComponent(name.trim())}`);
      return response.data.exists || '该姓名未在用户列表中';
    } catch (error) {
      console.error('验证用户名失败:', error);
      return '用户验证失败';
    }
  };

  useEffect(() => {
    fetchDutyInfo();
  }, []);

  const fetchDutyInfo = async () => {
    try {
      const res = await axiosInstance.get('/duty_info');
      const data = res.data;

      setValue('duty_officer', data.duty_officer);
      setValue('duty_cadre', data.duty_cadre);
      setValue('team_on_duty', data.team_on_duty);
      
      // 触发表单验证
      await trigger(['duty_cadre', 'team_on_duty']);
    } catch (error) {
      console.error('获取值班信息失败:', error);
      toast.error('获取值班信息失败');
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.put('/duty_info', data);
      toast.success('值班信息更新成功');
      reset(data);
    } catch (error) {
      console.error('更新值班信息失败:', error);
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
              值班信息填报
            </h1>

            {fetching ? (
              <div className="flex justify-center">
                <FaSpinner className="animate-spin text-gray-500 text-3xl" />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 值班干部 */}
                <FormField label="值班干部" icon={FaUserTie} error={errors.duty_officer}>
                  <select
                    {...register('duty_officer', { required: '请选择值班干部' })}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                      errors.duty_officer ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                  >
                    <option value="">请选择</option>
                    <option value="田野">田野</option>
                    <option value="娄斌">娄斌</option>
                  </select>
                </FormField>

                {/* 值班员 */}
                <FormField label="值班员" icon={FaUser} error={errors.duty_cadre}>
                  <input
                    type="text"
                    {...register('duty_cadre', { 
                      required: '值班员是必填项',
                      validate: validateUserName
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.duty_cadre ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                    placeholder="请输入值班员姓名"
                  />
                </FormField>

                {/* 队值日 */}
                <FormField label="队值日" icon={FaUser} error={errors.team_on_duty}>
                  <input
                    type="text"
                    {...register('team_on_duty', { 
                      required: '队值日是必填项',
                      validate: validateUserName
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.team_on_duty ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:outline-none focus:ring-2`}
                    placeholder="请输入队值日姓名"
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
                  <Button type="button" onClick={() => fetchDutyInfo()} variant="secondary">
                    重新加载
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

export default DutyInfo;