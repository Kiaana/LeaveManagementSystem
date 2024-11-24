// pages/major/[major].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../../services/axiosConfig';
import PageTransition from '../../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaArrowLeft, FaClock,} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Card from '../../components/Card';
import dayjs from 'dayjs';

const LeaveStatus = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case '请假中':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case '超假':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-green-100 text-green-800 border border-green-200';
    }
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyle()} transition-all duration-200 hover:shadow-sm`}>
      {status}
    </span>
  );
};


const MajorDetail = () => {
  const router = useRouter();
  const { major } = router.query;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [majorName, setMajorName] = useState('');

  useEffect(() => {
    if (major) {
      setMajorName(decodeURIComponent(major));
      fetchUsers();
    }
  }, [major]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/users/on_leave', {
        params: {
          major: decodeURIComponent(major),
        }
      });
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('获取学生信息失败');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    // utc时间转本地时间
    const utcDate = new Date(dateTime);
    const timeZoneOffset = utcDate.getTimezoneOffset() * 60000;
    const localDate = new Date(utcDate.getTime() - timeZoneOffset);
    // 格式化输出
    return dayjs(localDate).format('YYYY-MM-DD HH:mm');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 bg-white px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
            >
              <FaArrowLeft className="mr-2" />
              返回
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-white p-6 rounded-xl"
          >
            <h1 className="text-3xl font-bold text-gray-800">
              {majorName} - 学生详情
            </h1>
          </motion.div>

          <AnimatePresence>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
                <p className="text-gray-600">加载中...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {users.filter(user => user.status !== '在位').map((user) => (
                  <Card key={user.id} className="transform transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
                  <div className="p-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-gray-500 mt-1">{user.student_id}</p>
                      </div>
                      <LeaveStatus status={user.status} />
                    </div>
                
                    {/* Leave Details */}
                    {user.active_leave && (
                      <div className="space-y-4">
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                          <FaClock className="mr-3 text-blue-500" />
                          <span className="font-medium">请假事由: {user.active_leave.leave_type}</span>
                        </div>
                
                        {/* Timeline and Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="space-y-2 pl-2">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500">开始时间</span>
                              <span className="font-medium mt-1">{formatDateTime(user.active_leave.start_time)}</span>
                            </div>
                            <div className="flex items-center">
                              <div>
                                <span className="text-sm text-gray-500">去向</span>
                                <p className="font-medium mt-1">{user.active_leave.destination}</p>
                              </div>
                            </div>
                          </div>
                
                          {/* Right Column */}
                          <div className="space-y-2 pl-2">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500">预计返回时间</span>
                              <span className="font-medium mt-1">{formatDateTime(user.active_leave.expected_return_time)}</span>
                            </div>
                            <div className="flex items-center">
                              <div>
                                <span className="text-sm text-gray-500">审批人</span>
                                <p className="font-medium mt-1">{user.active_leave.approver}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
                ))}

                {users.filter(user => user.status !== '在位').length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-xl shadow-sm"
                  >
                    <p className="text-gray-500 text-lg">当前没有请假或超假的学生</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default MajorDetail;