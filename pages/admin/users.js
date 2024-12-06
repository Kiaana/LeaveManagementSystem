// pages/admin/users.js

import { useState, useEffect, useCallback } from 'react';
import {
    FaPlus,
    FaSpinner,
    FaUserShield,
    FaTrash,
    FaSearch,
} from 'react-icons/fa';
import axiosInstance from '../../services/axiosConfig';
import PageTransition from '../../components/PageTransition';
import ProtectedRoute from '../../components/ProtectedRoute';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import { Dialog, DialogTitle, DialogPanel } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState({
        total: 0,
        pages: 1,
        current_page: 1,
        per_page: 10,
    });
    const [filters, setFilters] = useState({
        name: '',
        student_id: '',
        major: '',
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    // 获取用户列表
    const fetchUsers = async (page = 1, currentFilters = filters) => {
        setLoading(true);
        try {
            const params = {
                page,
                per_page: pageInfo.per_page,
                ...Object.fromEntries(
                    Object.entries(currentFilters).filter(([_, value]) => value.trim() !== '')
                ),
            };

            const response = await axiosInstance.get('/users', { params });
            setUsers(response.data.data);
            setPageInfo({
                total: response.data.total,
                pages: response.data.pages,
                current_page: response.data.current_page,
                per_page: response.data.per_page,
            });
        } catch (error) {
            toast.error('获取用户列表失败');
            console.error('获取用户列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 防抖搜索
    const debouncedFetch = useCallback(
        debounce((newFilters) => {
            fetchUsers(1, newFilters);
        }, 500),
        []
    );

    // 处理筛选条件变化
    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        debouncedFetch(newFilters);
    };

    useEffect(() => {
        fetchUsers();
        // 清理防抖
        return () => {
            debouncedFetch.cancel();
        };
    }, []);

    // 添加用户
    const onSubmitAdd = async (data) => {
        setActionLoading(true);
        try {
            await axiosInstance.post('/users', data);
            toast.success('用户添加成功');
            setIsAddModalOpen(false);
            reset();
            fetchUsers(pageInfo.current_page);
        } catch (error) {
            toast.error(error.response?.data?.error || '添加用户失败');
            console.error('添加用户失败:', error);
        } finally {
            setActionLoading(false);
        }
    };

    // 删除用户
    const handleDelete = async (userId) => {
        if (!window.confirm('确定要删除此用户吗？')) return;

        setActionLoading(true);
        try {
            await axiosInstance.delete(`/users/${userId}`);
            toast.success('用户删除成功');
            fetchUsers(pageInfo.current_page);
        } catch (error) {
            toast.error(error.response?.data?.error || '删除用户失败');
            console.error('删除用户失败:', error);
        } finally {
            setActionLoading(false);
        }
    };

    // 修改用户权限
    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (currentRole === 'superadmin') {
            toast.error('无法修改 superadmin 的角色');
            return;
        }

        if (!window.confirm(`确定要将此用户权限修改为 ${newRole} 吗？`)) return;

        setActionLoading(true);
        try {
            await axiosInstance.put(`/users/${userId}/role`, { role: newRole });
            toast.success('用户权限修改成功');
            fetchUsers(pageInfo.current_page);
        } catch (error) {
            toast.error(error.response?.data?.error || '修改权限失败');
            console.error('修改权限失败:', error);
        } finally {
            setActionLoading(false);
        }
    };

    // 获取角色对应的样式
    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case 'superadmin':
                return 'bg-red-100 text-red-800';
            case 'admin':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // 定义表格列配置
    const columns = [
        {
            header: '学号',
            accessor: 'student_id'
        },
        {
            header: '姓名',
            accessor: 'name'
        },
        {
            header: '专业',
            accessor: 'major'
        },
        {
            header: '角色',
            accessor: 'role',
            render: (role) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeStyle(role)}`}>
                    {role}
                </span>
            )
        },
        {
            header: '操作',
            accessor: 'actions',
            render: (_, user) => (
                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={() => handleRoleChange(user.id, user.role)}
                        variant={user.role === 'admin' ? 'info' : 'success'}
                        size="sm"
                        disabled={actionLoading || user.role === 'superadmin'}
                    >
                        <FaUserShield className="mr-1" />
                        {user.role === 'admin' ? '取消管理员' : '设为管理员'}
                    </Button>
                    <Button
                        onClick={() => handleDelete(user.id)}
                        variant="danger"
                        size="sm"
                        disabled={actionLoading || user.role === 'superadmin'}
                    >
                        <FaTrash className="mr-1" />
                        删除
                    </Button>
                </div>
            )
        }
    ];

    return (
        <ProtectedRoute requiredRole="superadmin">
            <PageTransition>
                <div className="min-h-screen bg-white py-2 lg:py-8">
                    <div className="container mx-auto px-4">
                        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6">
                            {/* 标题部分 */}
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 lg:mb-6">
                                <div className="mb-4 lg:mb-0">
                                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800">用户管理</h1>
                                    <p className="text-xs lg:text-sm text-gray-600 mt-1">
                                        共 {pageInfo.total} 条记录
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setIsAddModalOpen(true)}
                                    variant="primary"
                                    size="sm"
                                    disabled={actionLoading}
                                    className="w-full lg:w-auto"
                                >
                                    <FaPlus className="mr-1 lg:mr-2" />
                                    添加用户
                                </Button>
                            </div>

                            {/* 筛选区域 */}
                            <div className="mb-4 lg:mb-6 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={filters.name}
                                        onChange={(e) => handleFilterChange('name', e.target.value)}
                                        placeholder="搜索姓名"
                                        className="w-full pl-9 pr-3 py-2 text-sm lg:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={filters.student_id}
                                        onChange={(e) => handleFilterChange('student_id', e.target.value)}
                                        placeholder="搜索学号"
                                        className="w-full pl-9 pr-3 py-2 text-sm lg:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={filters.major}
                                        onChange={(e) => handleFilterChange('major', e.target.value)}
                                        placeholder="搜索专业"
                                        className="w-full pl-9 pr-3 py-2 text-sm lg:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* 用户列表 */}
                            <DataTable
                                columns={columns}
                                data={users}
                                loading={loading}
                                emptyMessage="暂无用户数据"
                            />

                            {pageInfo.pages > 1 && (
                                <Pagination
                                    currentPage={pageInfo.current_page}
                                    totalPages={pageInfo.pages}
                                    onPageChange={(page) => fetchUsers(page)}
                                />
                            )}
                        </div>
                    </div>

                    {/* 添加用户弹窗 */}
                    <Dialog
                        open={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        className="relative z-50"
                    >
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <DialogPanel className="bg-white rounded-lg max-w-md w-full p-6">
                                <DialogTitle as="h3" className="text-lg font-medium mb-4">
                                    添加用户
                                </DialogTitle>

                                <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
                                    {/* 学号 */}
                                    <FormField label="学号" error={errors.student_id}>
                                        <input
                                            {...register('student_id', { required: '请输入学号' })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="例如：2021002"
                                        />
                                    </FormField>

                                    {/* 姓名 */}
                                    <FormField label="姓名" error={errors.name}>
                                        <input
                                            {...register('name', { required: '请输入姓名' })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="例如：李四"
                                        />
                                    </FormField>

                                    {/* 密码 */}
                                    <FormField label="密码" error={errors.password}>
                                        <input
                                            type="password"
                                            {...register('password', { required: '请输入密码' })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="请输入密码"
                                        />
                                    </FormField>

                                    {/* 专业 */}
                                    <FormField label="专业" error={errors.major}>
                                        <input
                                            {...register('major', { required: '请输入专业' })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="例如：计算机科学"
                                        />
                                    </FormField>

                                    {/* 角色 */}
                                    <FormField label="角色" error={errors.role}>
                                        <select
                                            {...register('role')}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            defaultValue="user"
                                        >
                                            <option value="user">用户</option>
                                            <option value="admin">管理员</option>
                                            <option value="superadmin" disabled>
                                                超级管理员
                                            </option>
                                        </select>
                                    </FormField>

                                    {/* 操作按钮 */}
                                    <div className="flex justify-end space-x-4 mt-6">
                                        <Button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            variant="secondary"
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? (
                                                <>
                                                    <FaSpinner className="animate-spin mr-2" />
                                                    提交中...
                                                </>
                                            ) : (
                                                '确定'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </div>
                    </Dialog>
                </div>
            </PageTransition>
        </ProtectedRoute>
    );
};

export default UsersPage;