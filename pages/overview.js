// pages/overview.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import PageTransition from '../components/PageTransition';
import { FaSpinner, FaDownload, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Overview = () => {
  const router = useRouter();
  const { query } = router;
  const [leaves, setLeaves] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    leave_type: '',
    destination: '',
    start_date: '',
    end_date: '',
    is_cancelled: '',
    is_overdue: '',
  });
  const [loading, setLoading] = useState(false);

  // Function to apply initial filters from URL query parameters
  useEffect(() => {
    if (query) {
      const initialFilters = { ...filters };

      // Parse and set query parameters to filters
      if (query.name) initialFilters.name = query.name;
      if (query.leave_type) initialFilters.leave_type = query.leave_type;
      if (query.destination) initialFilters.destination = query.destination;
      if (query.start_date) initialFilters.start_date = query.start_date;
      if (query.end_date) initialFilters.end_date = query.end_date;
      if (query.is_cancelled) initialFilters.is_cancelled = query.is_cancelled;
      if (query.is_overdue) initialFilters.is_overdue = query.is_overdue;

      setFilters(initialFilters);
      fetchLeaves(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchLeaves = async (currentFilters = filters) => {
    setLoading(true);
    try {
      // Remove empty filters
      const params = {};
      Object.keys(currentFilters).forEach((key) => {
        if (currentFilters[key] !== '') {
          params[key] = currentFilters[key];
        }
      });

      const res = await axiosInstance.get('/leave_requests', {
        params,
      });
      setLeaves(res.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('获取请销假信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    // Update the URL with current filters
    router.push({
      pathname: '/overview',
      query: {
        ...filters,
      },
    });
    fetchLeaves();
  };

  const handleExport = () => {
    const params = new URLSearchParams(
      Object.entries(filters)
        .filter(([key, value]) => value !== '')
        .map(([key, value]) => [key, value])
    ).toString();
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
            {/* 已销假 */}
            <div>
              <label className="block mb-1 font-semibold">已销假</label>
              <select
                name="is_cancelled"
                value={filters.is_cancelled}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">全部</option>
                <option value="true">已销假</option>
                <option value="false">未销假</option>
              </select>
            </div>
            {/* 超假 */}
            <div>
              <label className="block mb-1 font-semibold">超假</label>
              <select
                name="is_overdue"
                value={filters.is_overdue}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">全部</option>
                <option value="true">超假</option>
                <option value="false">未超假</option>
              </select>
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
              onClick={() => {
                // Reset filters and update URL
                const resetFilters = {
                  name: '',
                  leave_type: '',
                  destination: '',
                  start_date: '',
                  end_date: '',
                  is_cancelled: '',
                  is_overdue: '',
                };
                setFilters(resetFilters);
                router.push({
                  pathname: '/overview',
                  query: {},
                });
                fetchLeaves(resetFilters);
              }}
              className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              重置
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
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      姓名
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      请假类型
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      去向
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      起始时间
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      预计返回时间
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      实际返回时间
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaves.length > 0 ? (
                    leaves.map((leave, index) => (
                      <tr key={leave.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.leave_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(leave.start_time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(leave.expected_return_time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.actual_return_time
                            ? new Date(leave.actual_return_time).toLocaleString()
                            : '未销假'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                          <Link href={`/edit/${leave.id}`} legacyBehavior>
                            <a className="flex items-center hover:underline">
                              <FaEdit className="mr-1" />
                              编辑
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        无符合条件的记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Overview;