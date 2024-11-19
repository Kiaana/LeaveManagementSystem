// pages/index.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import PageTransition from '../components/PageTransition';
import { FaSpinner, FaUserClock, FaCheckCircle, FaExclamationCircle, FaHistory } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DataTable from '../components/DataTable';
import Card from '../components/Card'; // 引入 Card 组件

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

  useEffect(() => {
    fetchStatistics();
    fetchRecentLeaves();
  }, []);

  const fetchStatistics = async () => {
    try {
      const res = await axiosInstance.get('/statistics');
      setStatistics(res.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('获取统计信息失败');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentLeaves = async () => {
    try {
      const res = await axiosInstance.get('/leave_requests', {
        params: {
          limit: 5,
          order: 'desc',
        },
      });
  
      const processedData = res.data.map((leave) => {
        const now = new Date(); // 当前本地时间
        const nowUTC = new Date(now.toISOString()); // 转换为 UTC 时间
  
        const expectedReturnTime = new Date(leave.expected_return_time); // 服务端时间为 UTC
        const actualReturnTime = leave.actual_return_time ? new Date(leave.actual_return_time) : null;
  
        let status = 'current'; // 默认状态为请假中
  
        if (actualReturnTime) {
          status = 'cancelled'; // 已销假
        } else if (expectedReturnTime < nowUTC) {
          status = 'overdue'; // 超假
        }
  
        return { ...leave, status }; // 添加 status 字段
      });
  
      setRecentLeaves(processedData);
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
      case 'cancelled_leaves':
        return { is_cancelled: 'true' };
      case 'over_leave':
        return { is_overdue: 'true' };
      default:
        return {};
    }
  };
  
    // 定义日期格式化函数
    const formatDate = (value) => {
      if (!value) return '-';
    
      // 解析为 UTC 时间
      const utcDate = new Date(value);
    
      // 获取本地时区的偏移量（以分钟为单位）
      const timeZoneOffset = utcDate.getTimezoneOffset() * 60000; // 转为毫秒
    
      // 转换为本地时间
      const localDate = new Date(utcDate.getTime() - timeZoneOffset);
    
      // 格式化为东八区时间
      const options = {
        // year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: false,
      };
      return new Intl.DateTimeFormat('zh-CN', options).format(localDate);
    };

  // 定义最近请销假记录的表格列
  const columns = [
    { header: '姓名', accessor: 'name' },
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
          请销假管理系统
        </motion.h1>

        {/* 统一的内容容器 */}
        <div className="max-w-4xl mx-auto">
          {/* StatCards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
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
              title="已销假人数"
              value={statistics.cancelled_leaves || 0}
              loading={loadingStats}
              bgColor="bg-green-50"
              iconColor="text-green-500"
              href={{ pathname: '/overview', query: buildFilterParams('cancelled_leaves') }}
            />
            <StatCard
              icon={FaExclamationCircle}
              title="超假人数"
              value={statistics.over_leave || 0}
              loading={loadingStats}
              bgColor="bg-red-50"
              iconColor="text-red-500"
              href={{ pathname: '/overview', query: buildFilterParams('over_leave') }}
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
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;