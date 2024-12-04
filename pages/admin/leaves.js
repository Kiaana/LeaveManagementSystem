// pages/admin/leaves.js
import { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaSpinner, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/axiosConfig';
import PageTransition from '../../components/PageTransition';
import ProtectedRoute from '../../components/ProtectedRoute';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import Link from 'next/link';
import { formatDate } from '../../utils/dateFormatter';

const LeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    pages: 0,
    current_page: 1,
    per_page: 10
  });
  const [filters, setFilters] = useState({
    name: '',
    major: '',
    leave_type: '',
    destination: '',
    destination_type: '',
    approver: '',
    is_cancelled: '',
    is_overdue: '',
    start_date: '',
    end_date: ''
  });

  const columns = [
    {
      header: '学员姓名',
      accessor: 'user.name',
      render: (_, row) => row.user?.name || '-'
    },
    {
      header: '专业',
      accessor: 'user.major',
      render: (_, row) => row.user?.major || '-',
      hideOnMobile: true
    },
    { header: '请假事由', accessor: 'leave_type' },
    { header: '去向', accessor: 'destination' },
    {
      header: '去向类型',
      accessor: 'destination_type',
      hideOnMobile: true
    },
    { header: '审批人', accessor: 'approver' },
    {
      header: '开始时间',
      accessor: 'start_time',
      render: (value) => formatDate(value)
    },
    {
      header: '预计返回',
      accessor: 'expected_return_time',
      render: (value) => formatDate(value),
      hideOnMobile: true
    },
    {
      header: '实际返回',
      accessor: 'actual_return_time',
      render: (value) => value ? formatDate(value) : '未销假',
      hideOnMobile: true
    },
    {
      header: '操作',
      accessor: 'actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Link href={`/edit/${row.id}`}>
            <Button variant="secondary" size="sm">
              <FaEdit className="mr-1" />
              编辑  
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash className="mr-1" />
            删除
          </Button>
        </div>
      )
    }
  ];

  const fetchLeaves = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: pageInfo.per_page,
        ...filters
      };
      
      const response = await axiosInstance.get('/leave_requests', { params });
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
  }, [filters, pageInfo.per_page]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchLeaves(1);
  };

  const handleFilterReset = () => {
    setFilters({
      name: '',
      major: '',
      leave_type: '',
      destination: '',
      destination_type: '',
      approver: '',
      is_cancelled: '',
      is_overdue: '',
      start_date: '',
      end_date: ''
    });
    fetchLeaves(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除此请假记录吗？')) return;
    
    try {
      await axiosInstance.delete(`/leave_requests/${id}`);
      toast.success('删除成功');
      fetchLeaves(pageInfo.current_page);
    } catch (error) {
      toast.error(error.response?.data?.error || '删除失败');
    }
  };

  const handleBatchDelete = async () => {
    if (!window.confirm('确定要删除所有请假记录吗？此操作不可恢复！')) return;
    
    try {
      await axiosInstance.delete('/leave_requests');
      toast.success('批量删除成功');
      fetchLeaves(1);
    } catch (error) {
      toast.error('批量删除失败');
    }
  };

  const FilterForm = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <form onSubmit={handleFilterSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="搜索姓名"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">专业</label>
            <input
              type="text"
              name="major"
              value={filters.major}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入专业"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">请假类型</label>
            <select
              name="leave_type"
              value={filters.leave_type}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部</option>
              <option value="事假">事假</option>
              <option value="病假">病假</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">销假状态</label>
            <select
              name="is_cancelled"
              value={filters.is_cancelled}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部</option>
              <option value="true">已销假</option>
              <option value="false">未销假</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <Button type="button" variant="secondary" onClick={handleFilterReset}>
            重置
          </Button>
          <Button type="submit" variant="primary">
            <FaFilter className="mr-2" />
            筛选
          </Button>
        </div>
      </form>
      </div>
  );


  return (
    <ProtectedRoute requiredRole={['admin', 'superadmin']}>
      <PageTransition>
        <div className="min-h-screen bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">请假记录管理</h1>
                <p className="text-sm text-gray-600 mt-1">
                  共 {pageInfo.total} 条记录
                </p>
              </div>
              <Button
                variant="danger"
                onClick={handleBatchDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    处理中...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    批量删除
                  </>
                )}
              </Button>
            </div>

            <FilterForm />

            <div className="bg-white rounded-xl shadow-sm">
              <DataTable
                columns={columns}
                data={leaves}
                loading={loading}
                emptyMessage="暂无请假记录"
              />
            </div>

            {pageInfo.pages > 1 && (
              <Pagination
                currentPage={pageInfo.current_page}
                totalPages={pageInfo.pages}
                onPageChange={(page) => fetchLeaves(page)}
              />
            )}
          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
};

export default LeavesPage;