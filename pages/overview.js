import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Overview = () => {
  const [leaves, setLeaves] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    leave_type: '',
    destination: '',
    start_date: '',
    end_date: '',
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/leave_requests', {
        params: filters,
      });
      setLeaves(res.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLeaves();
  };

  const handleExport = () => {
    const params = new URLSearchParams(filters).toString();
    window.open(`http://127.0.0.1:5000/api/export?${params}`, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">信息总览</h1>

      {/* 筛选表单 */}
      <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1">姓名</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">请假类型</label>
          <input
            type="text"
            name="leave_type"
            value={filters.leave_type}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">去向</label>
          <input
            type="text"
            name="destination"
            value={filters.destination}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">起始日期</label>
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">结束日期</label>
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            筛选
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            导出数据
          </button>
        </div>
      </form>

      {/* 数据表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
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
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td className="py-2 px-4 border-b">{leave.name}</td>
                <td className="py-2 px-4 border-b">{leave.leave_type}</td>
                <td className="py-2 px-4 border-b">{leave.destination}</td>
                <td className="py-2 px-4 border-b">{new Date(leave.start_time).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{new Date(leave.expected_return_time).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">
                  {leave.actual_return_time
                    ? new Date(leave.actual_return_time).toLocaleString()
                    : '未销假'}
                </td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={`/edit/${leave.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    编辑
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Overview;