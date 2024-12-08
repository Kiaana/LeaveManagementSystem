// pages/profile.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaUser, FaBirthdayCake, FaLock } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import FormField from '../components/FormField';
import Button from '../components/Button';
import ProtectedRoute from '../components/ProtectedRoute';
import axiosInstance from '../services/axiosConfig';

const ProfileContent = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  const { register: registerInfo, handleSubmit: handleSubmitInfo, formState: { errors: errorsInfo }, reset: resetInfo } = useForm();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword }, reset: resetPassword, watch } = useForm();
  
  const newPassword = watch('new_password');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/user/profile');
        setProfileData(res.data);
        resetInfo({
          birthday: res.data.birthday || '',
          is_lunar_birthday: res.data.is_lunar_birthday
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('获取个人信息失败');
      }
    };
    fetchProfile();
  }, [resetInfo]);

  const onSubmitInfo = async (data) => {
    setLoading(true);
    try {
      const payload = {
        birthday: data.birthday || undefined,
        is_lunar_birthday: data.is_lunar_birthday === 'true'
      };

      const res = await axiosInstance.put('/user/profile', payload);
      setProfileData(res.data);
      toast.success('个人信息更新成功');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.put('/user/password', {
        old_password: data.old_password,
        new_password: data.new_password
      });
      toast.success('密码修改成功');
      resetPassword();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.error || '密码修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              个人信息
            </h1>

            <div className="flex mb-6 space-x-4 border-b">
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-2 px-4 ${
                  activeTab === 'info' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500'
                }`}
              >
                基本信息
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`pb-2 px-4 ${
                  activeTab === 'password' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500'
                }`}
              >
                修改密码
              </button>
            </div>

            {activeTab === 'info' && profileData && (
              <div className="space-y-6">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <FaUser className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">学号</p>
                      <p className="font-medium">{profileData.student_id}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <FaUser className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">姓名</p>
                      <p className="font-medium">{profileData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <FaUser className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">专业</p>
                      <p className="font-medium">{profileData.major}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <FaBirthdayCake className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">生日信息</p>
                      <p className="font-medium">
                        阳历：{profileData.birthday || '未设置'}
                      </p>
                      <p className="font-medium">
                        农历：{profileData.lunar_birthday || '未设置'}
                      </p>
                      <p className="text-sm text-gray-500">
                        提醒类型：{profileData.is_lunar_birthday ? '农历生日提醒' : '阳历生日提醒'}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitInfo(onSubmitInfo)} className="space-y-6">
                  <FormField label="出生日期" icon={FaBirthdayCake} error={errorsInfo.birthday}>
                    <input
                      type="date"
                      {...registerInfo('birthday')}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-2"
                    />
                  </FormField>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">生日提醒类型</label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...registerInfo('is_lunar_birthday')}
                          value="false"
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">提醒阳历生日</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...registerInfo('is_lunar_birthday')}
                          value="true"
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">提醒农历生日</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button type="submit" disabled={loading} variant="primary">
                      {loading ? '更新中...' : '更新信息'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                <FormField label="当前密码" icon={FaLock} error={errorsPassword.old_password}>
                  <input
                    type="password"
                    {...registerPassword('old_password', { 
                      required: '请输入当前密码' 
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-2"
                    placeholder="请输入当前密码"
                  />
                </FormField>

                <FormField label="新密码" icon={FaLock} error={errorsPassword.new_password}>
                  <input
                    type="password"
                    {...registerPassword('new_password', {
                      required: '请输入新密码',
                      minLength: { value: 6, message: '密码长度至少为6位' }
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-2"
                    placeholder="请输入新密码"
                  />
                </FormField>

                <FormField label="确认新密码" icon={FaLock} error={errorsPassword.confirm_password}>
                  <input
                    type="password"
                    {...registerPassword('confirm_password', {
                      required: '请确认新密码',
                      validate: value => value === newPassword || '两次输入的密码不一致'
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-2"
                    placeholder="请再次输入新密码"
                  />
                </FormField>

                <div className="flex justify-center pt-4">
                  <Button type="submit" disabled={loading} variant="primary">
                    {loading ? '修改中...' : '修改密码'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}