import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [statistics, setStatistics] = useState({});
  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    fetchStatistics();
    fetchRecentLeaves();
  }, []);

  const fetchStatistics = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/statistics');
      setStatistics(res.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchRecentLeaves = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/leave_requests', {
        params: {
          limit: 5,
          order: 'desc',
        },
      });
      setRecentLeaves(res.data);
    } catch (error) {
      console.error('Error fetching recent leaves:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">请销假管理系统</h1>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl">当前请假人数</h2>
          <p className="text-3xl font-bold">{statistics.current_leave || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl">已销假人数</h2>
          <p className="text-3xl font-bold">{statistics.cancelled_leaves || 0}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-xl">超假人数</h2>
          <p className="text-3xl font-bold">{statistics.over_leave || 0}</p>
        </div>
      </div>

      {/* 最近请销假记录 */}
      <h2 className="text-xl font-bold mb-4">最近请销假记录</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
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
                <td className="py-2 px-4 border-b">{new Date(leave.start_time).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{new Date(leave.expected_return_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;