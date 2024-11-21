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
import useUsers from '../hooks/useUsers';

const DutyInfo = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch, 
    reset,
    setError,
    clearErrors 
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { users, loadingUsers } = useUsers(); // 使用自定义 Hook
  const [nameValidated, setNameValidated] = useState(false);

  const dutyOfficer = watch('duty_officer');
  const dutyCadre = watch('duty_cadre');
  const teamOnDuty = watch('team_on_duty');

  useEffect(() => {
    fetchDutyInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const fetchDutyInfo = async () => {
    try {
      const res = await axiosInstance.get('/duty_info');
      const data = res.data;

      setValue('duty_officer', data.duty_officer);
      setValue('duty_cadre', data.duty_cadre);
      setValue('team_on_duty', data.team_on_duty);
      setNameValidated(true);
    } catch (error) {
      console.error('获取值班信息失败:', error);
      toast.error('获取值班信息失败');
    } finally {
      setFetching(false);
    }
  };

  const validateUserName = (name) => {
    if (!users.find(user => user.name === name.trim())) {
      return '该姓名未在用户列表中';
    }
    return true;
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

                {errors.submit && (
                  <p className="text-red-500 text-center">{errors.submit.message}</p>
                )}

                {/* 提交按钮 */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="submit" disabled={loading || !nameValidated} variant="primary">
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