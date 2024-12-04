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
    FaUserCircle,
    FaCaretDown,
    FaBirthdayCake,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuth();

    // 导航样式
    const navItemStyles = `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200`;
    const getActiveStyles = (path) => 
        router.pathname === path ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50';

    // 导航项分组
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
        // 只有 admin 和 superadmin 显示销假
        ...((['admin', 'superadmin'].includes(user.role)) ? [
            { path: '/cancel_leave', icon: FaSignOutAlt, label: '销假' }
        ] : []),
        { path: '/room_inspection', icon: FaClipboardList, label: '内务' },
        { title: '信息查询', icon: FaUniversity, items: infoNavItems },
    ] : [];

    const userNavItems = [
        { path: '/birthdays', icon: FaBirthdayCake, label: '生日' },
        ...(user ? [{ path: '/profile', icon: FaUserCircle, label: '个人信息' }] : []),
    ];

    // 合并移动端导航项
    const allNavItems = [
        ...mainNavItems,
        ...(user ? [
            // 请假始终显示
            { path: '/leave_request', icon: FaCalendarAlt, label: '请假' },
            // 销假只对特定角色显示
            ...((['admin', 'superadmin'].includes(user.role)) ? [
                { path: '/cancel_leave', icon: FaSignOutAlt, label: '销假' }
            ] : []),
            // 内务
            { path: '/room_inspection', icon: FaClipboardList, label: '内务' },
            // 展平信息查询菜单
            ...infoNavItems,
        ] : []),
        // 生日提醒和个人信息
        ...userNavItems,
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
        const timeoutRef = React.useRef(null);

        const handleMouseEnter = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setIsDropdownOpen(true);
        };

        const handleMouseLeave = () => {
            timeoutRef.current = setTimeout(() => {
                setIsDropdownOpen(false);
            }, 100);
        };

        return (
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button className={`${navItemStyles} text-gray-600 hover:text-blue-600 hover:bg-blue-50`}>
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
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2 text-gray-800 text-xl font-bold">
                        <FaClipboardList className="text-2xl text-blue-600" />
                        <span>请销假登记系统</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-1">
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

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <FiMenu size={24} />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {allNavItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${getActiveStyles(item.path)}`}
                            >
                                <item.icon className="mr-3 text-xl" />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {user ? (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    logout();
                                }}
                                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <FaSignOutAlt className="mr-3 text-xl" />
                                <span>登出</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
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