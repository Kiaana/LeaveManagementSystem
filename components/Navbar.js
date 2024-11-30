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
    FaBirthdayCake
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuth();

    // 导航项分组
    const mainNavItems = [
        { path: '/', icon: FaHome, label: '首页' },
    ];

    const leaveNavItems = user ? [
        { path: '/leave_request', icon: FaCalendarAlt, label: '请假登记' },
        { path: '/cancel_leave', icon: FaSignOutAlt, label: '销假登记' },
    ] : [];

    const infoNavItems = [
        { path: '/major_overview', icon: FaUniversity, label: '专业概览' },
        { path: '/duty_info', icon: FaClock, label: '值班信息' },
        { path: '/overview', icon: FaClipboardList, label: '信息总览' },
    ];

    // 下拉菜单组件
    const DropdownMenu = ({ items, title, icon: Icon }) => {
        const [isOpen, setIsOpen] = useState(false);
        const menuRef = useRef(null);
    
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (menuRef.current && !menuRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };
    
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);
    
        return (
            <div 
                ref={menuRef}
                className="relative" 
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <button 
                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    aria-expanded={isOpen}
                >
                    <Icon className="mr-2 text-lg" />
                    <span>{title}</span>
                    <FaCaretDown className="ml-1" />
                </button>
    
                {isOpen && (
                    <div 
                        className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                        onMouseEnter={() => setIsOpen(true)}
                    >
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
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                    ${router.pathname === item.path ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                            >
                                <item.icon className="mr-2 text-lg" />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {user && <DropdownMenu items={leaveNavItems} title="请假管理" icon={FaCalendarAlt} />}
                        <DropdownMenu items={infoNavItems} title="信息查询" icon={FaClipboardList} />
                        <Link
                            href="/birthdays"
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                ${router.pathname === '/birthdays' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                            <FaBirthdayCake className="mr-2 text-lg" />
                            <span>生日提醒</span>
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/profile"
                                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    <FaUserCircle className="mr-2 text-lg" />
                                    <span>个人信息</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    <FaSignOutAlt className="mr-2 text-lg" />
                                    <span>登出</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
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
                <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${router.pathname === item.path ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                            >
                                <item.icon className="mr-3 text-xl" />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {user && leaveNavItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <item.icon className="mr-3 text-xl" />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {infoNavItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <item.icon className="mr-3 text-xl" />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        <Link
                            href="/birthdays"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${router.pathname === '/birthdays' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                            <FaBirthdayCake className="mr-3 text-xl" />
                            <span>生日提醒</span>
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    <FaUserCircle className="mr-3 text-xl" />
                                    <span>个人信息</span>
                                </Link>
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
                            </>
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