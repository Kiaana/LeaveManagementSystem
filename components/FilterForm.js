// components/FilterForm.js
import React from 'react';

const FilterForm = ({ filters, handleChange, handleSubmit, handleReset }) => {
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-2xl font-semibold mb-4">筛选条件</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 姓名 */}
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold">姓名</label>
          <input
            type="text"
            name="name"
            id="name"
            value={filters.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="请输入姓名"
          />
        </div>
        {/* 请假类型 */}
        <div>
          <label htmlFor="leave_type" className="block mb-1 font-semibold">请假类型</label>
          <input
            type="text"
            name="leave_type"
            id="leave_type"
            value={filters.leave_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="例如：病假"
          />
        </div>
        {/* 去向 */}
        <div>
          <label htmlFor="destination" className="block mb-1 font-semibold">去向</label>
          <input
            type="text"
            name="destination"
            id="destination"
            value={filters.destination}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="例如：医院"
          />
        </div>
        {/* 起始日期 */}
        <div>
          <label htmlFor="start_date" className="block mb-1 font-semibold">起始日期</label>
          <input
            type="date"
            name="start_date"
            id="start_date"
            value={filters.start_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        {/* 结束日期 */}
        <div>
          <label htmlFor="end_date" className="block mb-1 font-semibold">结束日期</label>
          <input
            type="date"
            name="end_date"
            id="end_date"
            value={filters.end_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        {/* 已销假 */}
        <div>
          <label htmlFor="is_cancelled" className="block mb-1 font-semibold">已销假</label>
          <select
            name="is_cancelled"
            id="is_cancelled"
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
          <label htmlFor="is_overdue" className="block mb-1 font-semibold">超假</label>
          <select
            name="is_overdue"
            id="is_overdue"
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
          onClick={handleReset}
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          重置
        </button>
      </div>
    </form>
  );
};

export default FilterForm;