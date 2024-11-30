// components/Navbar.js
import Link from 'next/link';
import {
    FaHome,
    FaCalendarAlt,
    FaClipboardList,
    FaSignOutAlt,
    FaUniversity,
    FaClock,
    FaSignInAlt,
    FaUserCircle
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext'; // 导入 useAuth

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuth(); // 获取用户状态和登出方法

    // 处理滚动效果
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 关闭菜单的处理函数
    const handleClose = () => {
        setIsOpen(false);
    };

    // 检查当前路由是否激活
    const isActive = (path) => {
        return router.pathname === path;
    };

    // 根据是否登录显示不同的导航项
    const navItems = [
        { path: '/', icon: FaHome, label: '首页' },
        { path: '/major_overview', icon: FaUniversity, label: '专业概览' },
        { path: '/duty_info', icon: FaClock, label: '值班信息' },
        { path: '/overview', icon: FaClipboardList, label: '信息总览' },
        ...(user ? [
            { path: '/leave_request', icon: FaCalendarAlt, label: '请假登记' },
            { path: '/cancel_leave', icon: FaSignOutAlt, label: '销假登记' },
            { path: '/profile', icon: FaUserCircle, label: '个人信息' },
        ] : []),
    ];

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 text-gray-800 text-xl font-bold">
                        <FaClipboardList className="text-2xl text-blue-600" />
                        <span>请销假登记系统</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                    ${isActive(item.path)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                <item.icon className="mr-2 text-lg" />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {/* 登录/登出按钮 */}
                        {user ? (
                            <button
                                onClick={logout}
                                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                            >
                                <FaSignOutAlt className="mr-2 text-lg" />
                                <span>登出</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                            >
                                <FaSignInAlt className="mr-2 text-lg" />
                                <span>登录</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
                    >
                        <FiMenu size={24} />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0 pointer-events-none'
                        } overflow-hidden`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={handleClose}
                                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                                    ${isActive(item.path)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                <item.icon className="mr-3 text-xl" />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {/* 移动端登录/登出按钮 */}
                        {user ? (
                            <button
                                onClick={() => {
                                    handleClose();
                                    logout();
                                }}
                                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 w-full"
                            >
                                <FaSignOutAlt className="mr-3 text-xl" />
                                <span>登出</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={handleClose}
                                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <FaSignInAlt className="mr-3 text-xl" />
                                <span>登录</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;