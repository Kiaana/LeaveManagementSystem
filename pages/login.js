import React, { useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { FaSpinner, FaUser, FaLock } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import FormField from '../components/FormField';
import Button from '../components/Button';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirect = router.query.redirect || '/';

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await axiosInstance.post('/login', data);
      toast.success('登录成功');
      router.push(redirect); // 登录成功后跳转
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(error.response?.data?.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white py-8">
        <div className="container max-w-md mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            用户登录
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="学号" icon={FaUser} error={errors.student_id}>
              <input
                type="text"
                {...register('student_id', { required: '请输入学号' })}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  errors.student_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="请输入您的学号"
              />
            </FormField>

            <FormField label="密码" icon={FaLock} error={errors.password}>
              <input
                type="password"
                {...register('password', { required: '请输入密码' })}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="请输入您的密码"
              />
            </FormField>

            <div className="flex justify-center pt-4">
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    登录中...
                  </>
                ) : '登录'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;