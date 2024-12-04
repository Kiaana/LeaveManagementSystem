import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaUsers, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import PageTransition from '../../components/PageTransition';
import ProtectedRoute from '../../components/ProtectedRoute';

const AdminDashboard = () => {
  const menuItems = [
    {
      title: '用户管理',
      description: '管理系统用户，包括添加、编辑和删除用户',
      icon: FaUsers,
      path: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: '请假管理',
      description: '查看和管理所有用户的请假申请',
      icon: FaCalendarAlt,
      path: '/admin/leaves',
      color: 'bg-green-500'
    },
    {
      title: '内务管理',
      description: '管理宿舍内务检查记录',
      icon: FaClipboardList,
      path: '/admin/inspections',
      color: 'bg-purple-500'
    }
  ];

  return (
    <ProtectedRoute requiredRole={['admin', 'superadmin']}>
      <PageTransition>
        <div className="min-h-screen bg-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">管理后台</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="block transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className={`inline-flex p-3 rounded-lg ${item.color} text-white mb-4`}>
                      <item.icon className="text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
};

export default AdminDashboard;