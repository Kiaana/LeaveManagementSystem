// pages/overview.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import PageTransition from '../components/PageTransition';
import { FaSpinner, FaDownload, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';

const Overview = () => {
  const [leaves, setLeaves] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    leave_type: '',
    destination: '',
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/leave_requests', {
        params: filters,
      });
      setLeaves(res.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('获取请销假信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLeaves();
  };

  const handleExport = () => {
    const params = new URLSearchParams(filters).toString();
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/export?${params}`, '_blank');
    toast.info('正在导出数据...');
  };

  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">信息总览</h1>

        {/* 筛选表单 */}
        <form onSubmit={handleFilter} className="max-w-4xl mx-auto bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">筛选条件</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 姓名 */}
            <div>
              <label className="block mb-1 font-semibold">姓名</label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="请输入姓名"
              />
            </div>
            {/* 请假类型 */}
            <div>
              <label className="block mb-1 font-semibold">请假类型</label>
              <input
                type="text"
                name="leave_type"
                value={filters.leave_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="例如：病假"
              />
            </div>
            {/* 去向 */}
            <div>
              <label className="block mb-1 font-semibold">去向</label>
              <input
                type="text"
                name="destination"
                value={filters.destination}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="例如：医院"
              />
            </div>
            {/* 起始日期 */}
            <div>
              <label className="block mb-1 font-semibold">起始日期</label>
              <input
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            {/* 结束日期 */}
            <div>
              <label className="block mb-1 font-semibold">结束日期</label>
              <input
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
          {/* 按钮 */}
          <div className="flex justify-end mt-4 space-x-4">
            <button
              type="submit"
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              筛选
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              <FaDownload className="mr-2" />
              导出数据
            </button>
          </div>
        </form>

        {/* 数据表格 */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin text-gray-500 text-3xl" />
            </div>
          ) : (
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">姓名</th>
                  <th className="py-2 px-4 border-b">请假类型</th>
                  <th className="py-2 px-4 border-b">去向</th>
                  <th className="py-2 px-4 border-b">起始时间</th>
                  <th className="py-2 px-4 border-b">预计返回时间</th>
                  <th className="py-2 px-4 border-b">实际返回时间</th>
                  <th className="py-2 px-4 border-b">操作</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="py-2 px-4 border-b">{leave.name}</td>
                      <td className="py-2 px-4 border-b">{leave.leave_type}</td>
                      <td className="py-2 px-4 border-b">{leave.destination}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(leave.start_time).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(leave.expected_return_time).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {leave.actual_return_time
                          ? new Date(leave.actual_return_time).toLocaleString()
                          : '未销假'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <Link href={`/edit/${leave.id}`} legacyBehavior>
                          <a className="flex items-center text-blue-500 hover:underline">
                            <FaEdit className="mr-1" />
                            编辑
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      无符合条件的记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Overview;