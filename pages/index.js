// pages/index.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import PageTransition from '../components/PageTransition';
import { FaSpinner, FaUserClock, FaCheckCircle, FaExclamationCircle, FaHistory, FaUserCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DataTable from '../components/DataTable';
import Card from '../components/Card';
import Pagination from '../components/Pagination';

const StatCard = ({ icon: Icon, title, value, loading, bgColor, iconColor, href }) => (
  <Link href={href} legacyBehavior>
    <motion.a
      className={`${bgColor} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center cursor-pointer`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className={`${iconColor} text-4xl mb-4`} />
      <h2 className="text-lg md:text-xl font-semibold text-center">{title}</h2>
      {loading ? (
        <FaSpinner className={`animate-spin ${iconColor} text-3xl mt-2`} />
      ) : (
        <p className="text-3xl md:text-4xl font-bold mt-2">{value}</p>
      )}
    </motion.a>
  </Link>
);

const Home = () => {
  const [statistics, setStatistics] = useState({});
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [totalPages, setTotalPages] = useState(1); // 总页数

  useEffect(() => {
    fetchStatistics();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchRecentLeaves();
    }
  }, [users]);

  const fetchStatistics = async () => {
    try {
      const res = await axiosInstance.get('/statistics');
      const overallStats = res.data.overall;
  
      // 更新统计数据
      setStatistics({
        ...overallStats,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('获取统计信息失败');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('获取用户信息失败');
    }
  };

  const fetchRecentLeaves = async (page = 1) => {
    try {
      const res = await axiosInstance.get('/leave_requests', {
        params: {
          page: page,
          per_page: 10, // 每页记录数
        },
      });
  
      const processedData = res.data.data.map((leave) => {
        const now = new Date();
        const nowLocal = new Date(now.toISOString());
        // 使用本地时间计算UTC时间
        const nowUTC = new Date(nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60000);
  
        const expectedReturnTime = new Date(leave.expected_return_time);
        const actualReturnTime = leave.actual_return_time ? new Date(leave.actual_return_time) : null;

        // 根据请假状态计算状态，共四种状态：current, cancelled, overdue, not_started
        let status = 'current';
        // 如果现在时间早于开始时间，则状态为未开始
        if (nowUTC < new Date(leave.start_time)) {
          status = 'not_started';
        } else if (actualReturnTime) {
          status = 'cancelled';
        } else if (expectedReturnTime < nowUTC) {
          status = 'overdue';
        }
  
        // 匹配用户姓名
        const user = users.find((u) => u.id === leave.user_id);
        const userName = user ? user.name : '未知用户';
  
        return { ...leave, status, user_name: userName };
      });
  
      setRecentLeaves(processedData);
      setTotalPages(res.data.pages); // 更新总页数
      setCurrentPage(res.data.current_page); // 更新当前页码
    } catch (error) {
      console.error('Error fetching recent leaves:', error);
      toast.error('获取最近请销假记录失败');
    } finally {
      setLoadingLeaves(false);
    }
  };

  // 根据统计类型构建查询参数
  const buildFilterParams = (type) => {
    switch (type) {
      case 'current_leave':
        return { is_cancelled: 'false' };
      case 'today_cancelled':
        const today = new Date().toISOString().split('T')[0];
        return { 
          is_cancelled: 'true', 
          start_date: today, 
          end_date: today 
        };
      case 'overdue_leave':
        return { is_overdue: 'true' };
      default:
        return {};
    }
  };

  // 定义日期格式化函数
  const formatDate = (value) => {
    if (!value) return '-';

    // 将UTC时间转换为本地时间
    const utcDate = new Date(value);
    const timeZoneOffset = utcDate.getTimezoneOffset() * 60000;
    const localDate = new Date(utcDate.getTime() - timeZoneOffset);

    const options = {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('zh-CN', options).format(localDate);
  };

  // 定义最近请销假记录的表格列
  const columns = [
    { header: '姓名', accessor: 'user_name' },
    { header: '请假类型', accessor: 'leave_type', hideOnMobile: false },
    { header: '起始时间', accessor: 'start_time', render: formatDate },
    { header: '预计返回时间', accessor: 'expected_return_time', hideOnMobile: false, render: formatDate },
  ];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6">
        <motion.h1
          className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          请销假登记系统
        </motion.h1>
  
        {/* 统一的内容容器 */}
        <div className="max-w-4xl mx-auto">
          {/* StatCards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* 统计卡片 */}
            <StatCard
              icon={FaUserClock}
              title="当前请假人数"
              value={statistics.current_leave || 0}
              loading={loadingStats}
              bgColor="bg-blue-50"
              iconColor="text-blue-500"
              href={{ pathname: '/overview', query: buildFilterParams('current_leave') }}
            />
            <StatCard
              icon={FaCheckCircle}
              title="今日已销假人数"
              value={statistics.today_cancelled || 0}
              loading={loadingStats}
              bgColor="bg-green-50"
              iconColor="text-green-500"
              href={{ pathname: '/overview', query: buildFilterParams('today_cancelled') }}
            />
            <StatCard
              icon={FaExclamationCircle}
              title="超假人数"
              value={statistics.overdue_leave || 0}
              loading={loadingStats}
              bgColor="bg-red-50"
              iconColor="text-red-500"
              href={{ pathname: '/overview', query: buildFilterParams('overdue_leave') }}
            />
            <StatCard
              icon={FaUserCheck}
              title="在位人数"
              value={statistics.present_students || 0}
              loading={loadingStats}
              bgColor="bg-yellow-50"
              iconColor="text-yellow-500"
              href="#"
            />
          </div>
  
          {/* 表格卡片 */}
          <Card>
            <div className="flex items-center mb-6">
              <FaHistory className="text-gray-500 text-xl mr-2" />
              <h2 className="text-xl font-bold text-gray-800">最近请销假记录</h2>
            </div>
            <DataTable
              columns={columns}
              data={recentLeaves}
              loading={loadingLeaves}
              emptyMessage="暂无请销假记录"
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchRecentLeaves(page)}
            />
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;