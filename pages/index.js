// pages/index.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import PageTransition from '../components/PageTransition';
import { FaSpinner, FaUserClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';

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
      setRecentLeaves(res.data);
    } catch (error) {
      console.error('Error fetching recent leaves:', error);
      toast.error('获取最近请销假记录失败');
    } finally {
      setLoadingLeaves(false);
    }
  };

  // Helper function to build query parameters based on statistic type
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

  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">欢迎使用请销假管理系统</h1>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* 当前请假人数 */}
          <Link href={{ pathname: '/overview', query: buildFilterParams('current_leave') }} legacyBehavior>
            <a className="bg-blue-100 p-6 rounded shadow hover:bg-blue-200 transition flex flex-col items-center">
              <FaUserClock className="text-blue-500 text-4xl mb-4" />
              <h2 className="text-xl font-semibold">当前请假人数</h2>
              {loadingStats ? (
                <FaSpinner className="animate-spin text-blue-500 text-3xl mt-2" />
              ) : (
                <p className="text-4xl font-bold">{statistics.current_leave || 0}</p>
              )}
            </a>
          </Link>

          {/* 已销假人数 */}
          <Link href={{ pathname: '/overview', query: buildFilterParams('cancelled_leaves') }} legacyBehavior>
            <a className="bg-green-100 p-6 rounded shadow hover:bg-green-200 transition flex flex-col items-center">
              <FaCheckCircle className="text-green-500 text-4xl mb-4" />
              <h2 className="text-xl font-semibold">已销假人数</h2>
              {loadingStats ? (
                <FaSpinner className="animate-spin text-green-500 text-3xl mt-2" />
              ) : (
                <p className="text-4xl font-bold">{statistics.cancelled_leaves || 0}</p>
              )}
            </a>
          </Link>

          {/* 超假人数 */}
          <Link href={{ pathname: '/overview', query: buildFilterParams('over_leave') }} legacyBehavior>
            <a className="bg-red-100 p-6 rounded shadow hover:bg-red-200 transition flex flex-col items-center">
              <FaExclamationCircle className="text-red-500 text-4xl mb-4" />
              <h2 className="text-xl font-semibold">超假人数</h2>
              {loadingStats ? (
                <FaSpinner className="animate-spin text-red-500 text-3xl mt-2" />
              ) : (
                <p className="text-4xl font-bold">{statistics.over_leave || 0}</p>
              )}
            </a>
          </Link>
        </div>

        {/* 最近请销假记录 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">最近请销假记录</h2>
          {loadingLeaves ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin text-gray-500 text-3xl" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">姓名</th>
                    <th className="py-2 px-4 border-b">请假类型</th>
                    <th className="py-2 px-4 border-b">起始时间</th>
                    <th className="py-2 px-4 border-b">预计返回时间</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="py-2 px-4 border-b">{leave.name}</td>
                      <td className="py-2 px-4 border-b">{leave.leave_type}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(leave.start_time).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(leave.expected_return_time).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;