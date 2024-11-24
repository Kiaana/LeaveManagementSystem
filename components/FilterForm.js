// components/FilterForm.js
import React, { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FilterForm = ({ filters, handleChange, handleSubmit, handleReset }) => {
  const [isExpanded, setIsExpanded] = useState(false); // 默认折叠

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300">
      {/* 筛选头部 */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={toggleExpanded}
      >
        <div className="flex items-center space-x-2">
          <FiFilter className="text-gray-600" />
          <h2 className="text-lg font-medium text-gray-700">筛选条件</h2>
          <span className="text-sm text-gray-500">
            {Object.values(filters).filter(Boolean).length > 0 && 
              `(${Object.values(filters).filter(Boolean).length} 个筛选条件)`
            }
          </span>
        </div>
        {isExpanded ? 
          <FiChevronUp className="text-gray-400" /> : 
          <FiChevronDown className="text-gray-400" />
        }
      </div>

      {/* 筛选表单 */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[800px]' : 'max-h-0'}`}>
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 姓名 */}
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={filters.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="请输入姓名"
              />
            </div>

            {/* 专业 */}
            <div className="form-group">
              <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                专业
              </label>
              <input
                type="text"
                name="major"
                id="major"
                value={filters.major}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="请输入专业"
              />
            </div>

            {/* 请假事由 */}
            <div className="form-group">
              <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700 mb-1">
                请假事由
              </label>
              <input
                type="text"
                name="leave_type"
                id="leave_type"
                value={filters.leave_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="例如：病假"
              />
            </div>

            {/* 去向 */}
            <div className="form-group">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                去向
              </label>
              <input
                type="text"
                name="destination"
                id="destination"
                value={filters.destination}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="例如：医院"
              />
            </div>

            {/* 去向类型 */}
            <div className="form-group">
              <label htmlFor="destination_type" className="block text-sm font-medium text-gray-700 mb-1">
                去向类型
              </label>
              <select
                name="destination_type"
                id="destination_type"
                value={filters.destination_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              >
                <option value="">全部</option>
                <option value="三号院内">三号院内</option>
                <option value="一号院">一号院</option>
                <option value="921医院">921医院</option>
                <option value="其他">其他</option>
              </select>
            </div>

            {/* 审批人 */}
            <div className="form-group">
              <label htmlFor="approver" className="block text-sm font-medium text-gray-700 mb-1">
                审批人
              </label>
              <input
                type="text"
                name="approver"
                id="approver"
                value={filters.approver}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="请输入审批人姓名"
              />
            </div>

            {/* 销假状态 */}
            <div className="form-group">
              <label htmlFor="is_cancelled" className="block text-sm font-medium text-gray-700 mb-1">
                销假状态
              </label>
              <select
                name="is_cancelled"
                id="is_cancelled"
                value={filters.is_cancelled}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              >
                <option value="">全部</option>
                <option value="true">已销假</option>
                <option value="false">未销假</option>
              </select>
            </div>

            {/* 超假状态 */}
            <div className="form-group">
              <label htmlFor="is_overdue" className="block text-sm font-medium text-gray-700 mb-1">
                超假状态
              </label>
              <select
                name="is_overdue"
                id="is_overdue"
                value={filters.is_overdue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              >
                <option value="">全部</option>
                <option value="true">超假</option>
                <option value="false">未超假</option>
              </select>
            </div>

            {/* 日期范围 */}
            <div className="form-group md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">日期范围</label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <span className="text-gray-500">至</span>
                <input
                  type="date"
                  name="end_date"
                  value={filters.end_date}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              重置
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              应用筛选
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterForm;