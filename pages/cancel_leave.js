// pages/cancel_leave.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../services/axiosConfig';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import ProtectedRoute from '../components/ProtectedRoute';
import { LeaveCard } from '../components/LeaveCard';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';

const CancelLeavePage = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    pages: 1,
    current_page: 1,
    per_page: 10
  });
  const [filters, setFilters] = useState({
    name: '',
    major: '',
    is_cancelled: 'false' // 默认只显示未销假记录
  });

  const fetchLeaves = async (page = 1) => {
    setLoading(true);
    try {
      let queryParams = {
        page,
        per_page: pageInfo.per_page,
        ...filters
      };
  
      // 根据用户角色添加不同的查询参数
      if (user.role === '负责人') {
        queryParams.approver = user.name;
      } else if (user.role === '干部') {
        queryParams.approver_role = '干部';
      }
      // 管理员不需要添加额外的查询参数
  
      const response = await axiosInstance.get('/leave_requests', { params: queryParams });
      setLeaves(response.data.data);
      setPageInfo({
        total: response.data.total,
        pages: response.data.pages,
        current_page: response.data.current_page,
        per_page: response.data.per_page
      });
    } catch (error) {
      toast.error('获取请假记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelLeave = async (id, method) => {
    setActionLoading(true);
    try {
      await axiosInstance.post(`/leave_requests/${id}/cancel`, {
        actual_return_time: new Date().toISOString(),
        cancellation_method: method
      });
      toast.success('销假成功');
      fetchLeaves(pageInfo.current_page);
    } catch (error) {
      toast.error(error.response?.data?.error || '销假失败');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole={['负责人', '干部', '管理员']}>
      <PageTransition>
        <div className="min-h-screen bg-white py-8">
          <div className="container mx-auto px-4">
            {/* 标题部分 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">销假管理</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    共 {pageInfo.total} 条记录
                  </p>
                </div>
              </div>

              {/* 筛选区域 */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    placeholder="搜索姓名"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.major}
                    onChange={(e) => handleFilterChange('major', e.target.value)}
                    placeholder="搜索专业"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 卡片列表 */}
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin text-3xl text-blue-500" />
              </div>
            ) : leaves.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaves.map(leave => (
                  <LeaveCard
                    key={leave.id}
                    data={leave}
                    onCancelLeave={handleCancelLeave}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">暂无请假记录</p>
              </div>
            )}

            {/* 分页 */}
            {pageInfo.pages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pageInfo.current_page}
                  totalPages={pageInfo.pages}
                  onPageChange={(page) => fetchLeaves(page)}
                />
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
};

export default CancelLeavePage;