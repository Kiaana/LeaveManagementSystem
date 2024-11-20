// components/Navbar.js
import Link from 'next/link';
import { FaHome, FaCalendarAlt, FaClipboardList, FaSignOutAlt, FaUniversity } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/router';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

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

    const navItems = [
        { path: '/', icon: FaHome, label: '首页' },
        { path: '/major_overview', icon: FaUniversity, label: '专业概览' },
        { path: '/leave_request', icon: FaCalendarAlt, label: '请假登记' },
        { path: '/cancel_leave', icon: FaSignOutAlt, label: '销假登记' },
        { path: '/overview', icon: FaClipboardList, label: '信息总览' },
    ];

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white shadow-md' : 'bg-white'
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
                    className={`lg:hidden transition-all duration-300 ease-in-out ${
                        isOpen
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
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;