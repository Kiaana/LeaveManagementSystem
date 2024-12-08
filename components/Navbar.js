// components/Navbar.js
import React from 'react';
import Link from 'next/link';
import {
    FaHome,
    FaCalendarAlt,
    FaClipboardList,
    FaSignOutAlt,
    FaUniversity,
    FaClock,
    FaSignInAlt,
    FaUserCircle,
    FaCaretDown,
    FaBirthdayCake,
    FaEllipsisH
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuth();

    // 导航样式
    const navItemStyles = `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200`;
    const getActiveStyles = (path) =>
        router.pathname === path ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50';

    // 定义导航项
    const mainNavItems = [
        { path: '/', icon: FaHome, label: '首页' },
    ];

    const infoNavItems = [
        { path: '/major_overview', icon: FaUniversity, label: '专业' },
        { path: '/duty_info', icon: FaClock, label: '值班' },
        { path: '/overview', icon: FaClipboardList, label: '请假总览' },
    ];

    const systemNavItems = user ? [
        { path: '/leave_request', icon: FaCalendarAlt, label: '请假' },
        ...((['负责人', '干部', '管理员'].includes(user.role)) ? [
            { path: '/cancel_leave', icon: FaSignOutAlt, label: '销假' }
        ] : []),
        { path: '/room_inspection', icon: FaClipboardList, label: '内务' },
        { title: '信息查询', icon: FaUniversity, items: infoNavItems },
    ] : [];

    const userNavItems = [
        { path: '/birthdays', icon: FaBirthdayCake, label: '生日' },
        ...(user ? [
            { path: '/profile', icon: FaUserCircle, label: '我的' },
            ...((user.role === '管理员') ? [
                { path: '/admin', icon: FaUniversity, label: '管理' }
            ] : []),
        ] : []),
    ];

    // 移动端导航项
    const mobileNavItems = user ? [
        { path: '/', icon: FaHome, label: '首页' },
        { path: '/leave_request', icon: FaCalendarAlt, label: '请假' },
        // 管理员和超级管理员才显示销假
        ...(['负责人', '干部', '管理员'].includes(user.role) ? [
            { path: '/cancel_leave', icon: FaSignOutAlt, label: '销假' }
        ] : []),
        { path: '/room_inspection', icon: FaClipboardList, label: '内务' },
        { path: '/others', icon: FaEllipsisH, label: '其他' }, // 修改路径和图标
    ] : [
        { path: '/', icon: FaHome, label: '首页' },
        { path: '/login', icon: FaSignInAlt, label: '登录' },
    ];

    // 导航项渲染函数
    const renderNavItem = (item) => (
        <Link
            key={item.path}
            href={item.path}
            className={`${navItemStyles} ${getActiveStyles(item.path)}`}
        >
            <item.icon className="mr-2 text-lg" />
            <span>{item.label}</span>
        </Link>
    );

    // 下拉菜单组件
    const DropdownMenu = ({ items, title, icon: Icon }) => {
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const dropdownRef = React.useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsDropdownOpen(false);
                }
            };

            document.addEventListener('click', handleClickOutside, true);
            return () => {
                document.removeEventListener('click', handleClickOutside, true);
            };
        }, []);

        return (
            <div ref={dropdownRef} className="relative">
                <button
                    className={`${navItemStyles} text-gray-600 hover:text-blue-600 hover:bg-blue-50`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <Icon className="mr-2 text-lg" />
                    <span>{title}</span>
                    <FaCaretDown className="ml-1" />
                </button>

                {isDropdownOpen && (
                    <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1">
                            {items.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <item.icon className="mr-2" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // 处理滚动效果
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* 桌面端导航栏 */}
            <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white shadow-md lg:flex hidden">
                <div className="w-full px-6">
                    <div className="flex items-center justify-between h-16 max-w-[1920px] mx-auto">
                        <Link href="/" className="flex items-center space-x-2 text-gray-800 text-xl font-bold shrink-0">
                            <FaClipboardList className="text-2xl text-blue-600" />
                            <span>请销假登记系统</span>
                        </Link>

                        <div className="flex items-center space-x-1">
                            {mainNavItems.map(renderNavItem)}
                            {systemNavItems.map((item) =>
                                item.items ? (
                                    <DropdownMenu
                                        key={item.title}
                                        items={item.items}
                                        title={item.title}
                                        icon={item.icon}
                                    />
                                ) : renderNavItem(item)
                            )}
                            {userNavItems.map(renderNavItem)}
                            {user ? (
                                <button
                                    onClick={logout}
                                    className={`${navItemStyles} text-gray-600 hover:text-blue-600 hover:bg-blue-50`}
                                >
                                    <FaSignOutAlt className="mr-2 text-lg" />
                                    <span>登出</span>
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className={`${navItemStyles} text-gray-600 hover:text-blue-600 hover:bg-blue-50`}
                                >
                                    <FaSignInAlt className="mr-2 text-lg" />
                                    <span>登录</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* 移动端底部导航栏 */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
                <div className={`grid ${!user
                        ? 'grid-cols-2' // 未登录时显示2列
                        : (['负责人', '干部', '管理员'].includes(user.role)
                            ? 'grid-cols-5' // 管理员显示5列
                            : 'grid-cols-4' // 普通用户显示4列
                        )
                    } h-16`}>
                    {mobileNavItems.map(item => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center space-y-1 ${router.pathname === item.path
                                    ? 'text-blue-600'
                                    : 'text-gray-600'
                                }`}
                        >
                            <item.icon className="text-xl" />
                            <span className="text-xs">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
};

export default Navbar;