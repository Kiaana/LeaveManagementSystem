// pages/others.js
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import {
    FaUniversity,
    FaClipboardList,
    FaTrophy,
    FaBirthdayCake,
    FaUserCircle,
    FaCog,
    FaSignOutAlt
} from 'react-icons/fa';
import PageTransition from '../components/PageTransition';

const OthersPage = () => {
    const { user } = useAuth();

    const menuItems = [
        {
            title: '专业在位',
            description: '查看各专业学员在位情况',
            icon: FaUniversity,
            path: '/major_overview',
            color: 'bg-blue-500'
        },
        {
            title: '请假总览',
            description: '查看所有请假记录',
            icon: FaClipboardList,
            path: '/overview',
            color: 'bg-green-500'
        },
        {
            title: '请假排行',
            description: '查看请假次数统计',
            icon: FaTrophy,
            path: '/leave_rank',
            color: 'bg-yellow-500'
        },
        {
            title: '生日提醒',
            description: '查看近期生日',
            icon: FaBirthdayCake,
            path: '/birthdays',
            color: 'bg-pink-500'
        },
        {
            title: '个人信息',
            description: '管理个人资料',
            icon: FaUserCircle,
            path: '/profile',
            color: 'bg-purple-500'
        },
        // 仅超级管理员可见
        ...(user?.role === 'superadmin' ? [{
            title: '系统管理',
            description: '管理用户和系统设置',
            icon: FaCog,
            path: '/admin',
            color: 'bg-gray-500'
        }] : []),
        // 退出登录
        ...(user ? [{
            title: '退出登录',
            description: '退出当前账号',
            icon: FaSignOutAlt,
            path: '/logout',
            color: 'bg-red-500'
        }] : [])
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 py-4 lg:py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">更多功能</h1>
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                className="block transition-transform duration-200 hover:-translate-y-1"
                            >
                                <div className="bg-white rounded-xl shadow p-4 h-full">
                                    <div className={`inline-flex p-2 rounded-lg ${item.color} text-white mb-3`}>
                                        <item.icon className="text-xl" />
                                    </div>
                                    <h2 className="text-base font-bold text-gray-800 mb-1">
                                        {item.title}
                                    </h2>
                                    <p className="text-xs text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default OthersPage;