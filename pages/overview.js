// pages/overview.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import PageTransition from '../components/PageTransition';
import { FaDownload, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DataTable from '../components/DataTable';
import FilterForm from '../components/FilterForm';
import Card from '../components/Card';
import Pagination from '../components/Pagination';

// 防抖机制，避免重复请求
let isFetching = false;
const fetchWithDebounce = async (fetchFunction) => {
  if (isFetching) return;
  isFetching = true;
  try {
    await fetchFunction();
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    isFetching = false;
  }
};

const Overview = () => {
  const router = useRouter();
  const { query } = router;

  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      if (query) {
        const initialFilters = { ...filters };
        Object.keys(query).forEach((key) => {
          if (initialFilters.hasOwnProperty(key)) {
            initialFilters[key] = query[key];
          }
        });

        setFilters(initialFilters);
        fetchLeaves(initialFilters, 1);
      } else {
        fetchLeaves(filters, 1);
      }
    }
  }, [users, query]);

  // 定时更新数据
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWithDebounce(() => fetchLeaves(filters, currentPage));
    }, 30000); // 每 30 秒刷新一次
    return () => clearInterval(interval);
  }, [filters, currentPage]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('获取用户列表失败');
    }
  };

  const fetchLeaves = async (currentFilters = filters, page = 1) => {
    setLoading(true);
    try {
      const params = { page, per_page: 10 };

      Object.keys(currentFilters).forEach((key) => {
        if (currentFilters[key] !== '') {
          if (key === 'name') {
            const matchedUsers = users.filter((user) => user.name === currentFilters.name);
            if (matchedUsers.length > 0) {
              params['user_id'] = matchedUsers[0].id;
            } else {
              params['user_id'] = -1; // 没有匹配到用户
            }
          } else {
            params[key] = currentFilters[key];
          }
        }
      });

      const res = await axiosInstance.get('/leave_requests', { params });

      setTotalPages(res.data.pages);
      setCurrentPage(res.data.current_page);

      const resData = res.data.data.map((leave) => {
        const user = users.find((user) => user.id === leave.user_id);
        const userName = user ? user.name : '未知用户';
        return { ...leave, user_name: userName };
      });

      setLeaves(resData);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('获取请销假信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理筛选条件的变化
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // 提交筛选条件
  const handleFilter = (e) => {
    e.preventDefault();
    // 更新URL中的查询参数
    router.push({
      pathname: '/overview',
      query: {
        ...filters,
      },
    });
    fetchLeaves();
  };

  // 重置筛选条件
  const handleReset = () => {
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
  };

  // 导出数据
  const handleExport = () => {
    if (leaves.length === 0) {
      toast.error('没有数据可导出');
      return;
    }

    const headers = ['姓名', '请假类型', '去向', '起始时间', '预计返回时间', '实际返回时间'];

    const rows = leaves.map((leave) => [
      leave.user_name || '未知用户',
      leave.leave_type || '未提供',
      leave.destination || '未提供',
      formatDate(leave.start_time),
      formatDate(leave.expected_return_time),
      leave.actual_return_time ? formatDate(leave.actual_return_time) : '未销假',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '请销假记录.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast.success('导出成功！');
  };

  // 本地时间格式化函数
  const formatDate = (value) => {
    if (!value) return '未提供时间';
    const utcDate = new Date(value);
    const timeZoneOffset = utcDate.getTimezoneOffset() * 60000;
    const localDate = new Date(utcDate.getTime() - timeZoneOffset);

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('zh-CN', options).format(localDate);
  };

  // 更新表格列定义
  const columns = [
    { header: '姓名', accessor: 'user_name' },
    { header: '请假类型', accessor: 'leave_type', hideOnMobile: false },
    { header: '去向', accessor: 'destination' },
    { header: '起始时间', accessor: 'start_time', render: (value) => formatDate(value) },
    { header: '预计返回时间', accessor: 'expected_return_time', hideOnMobile: false, render: (value) => formatDate(value) },
    { header: '实际返回时间', accessor: 'actual_return_time', render: (value) => (value ? formatDate(value) : '未销假') },
    {
      header: '操作',
      accessor: 'actions',
      render: (_, row) => (
        <Link href={`/edit/${row.id}`} legacyBehavior>
          <a className="flex items-center text-blue-500 hover:underline">
            <FaEdit className="mr-1" />
            编辑
          </a>
        </Link>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">信息总览</h1>

        {/* 统一的内容容器 */}
        <div className="max-w-4xl mx-auto">
          {/* 导出按钮 */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExport}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              <FaDownload className="mr-2" />
              导出数据
            </button>
          </div>

          {/* 筛选表单 */}
          <FilterForm
            filters={filters}
            handleChange={handleChange}
            handleSubmit={handleFilter}
            handleReset={handleReset}
          />

          {/* 数据表格 */}
          <Card className="mt-6">
            <DataTable
              columns={columns}
              data={leaves}
              loading={loading}
              emptyMessage="无符合条件的记录"
            />
            {/* 分页控件 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchLeaves(filters, page)}
            />
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Overview;