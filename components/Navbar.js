// components/Navbar.js
import Link from 'next/link';
import { FaHome, FaCalendarAlt, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800">
            <div className="container mx-auto flex items-center justify-between p-4">
                <div className="flex items-center text-white text-xl font-bold">
                    <FaClipboardList className="mr-2" />
                    请销假系统
                </div>
                <div className="hidden md:flex space-x-4">
                    <Link href="/" passHref>
                        <div className="flex items-center text-white hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
                            <FaHome className="mr-1" />
                            首页
                        </div>
                    </Link>
                    <Link href="/leave_request" passHref>
                        <div className="flex items-center text-white hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
                            <FaCalendarAlt className="mr-1" />
                            请假申请
                        </div>
                    </Link>
                    <Link href="/cancel_leave" passHref>
                        <div className="flex items-center text-white hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
                            <FaSignOutAlt className="mr-1" />
                            销假申请
                        </div>
                    </Link>
                    <Link href="/overview" passHref>
                        <div className="flex items-center text-white hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
                            <FaClipboardList className="mr-1" />
                            信息总览
                        </div>
                    </Link>
                </div>
                {/* 移动端菜单按钮 */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>
            {/* 移动端菜单 */}
            {isOpen && (
                <div className="md:hidden bg-gray-800">
                    <Link href="/" passHref>
                        <div className="block text-white hover:bg-gray-700 px-4 py-2 items-center cursor-pointer">
                            <FaHome className="mr-2" />
                            首页
                        </div>
                    </Link>
                    <Link href="/leave_request" passHref>
                        <div className="block text-white hover:bg-gray-700 px-4 py-2 items-center cursor-pointer">
                            <FaCalendarAlt className="mr-2" />
                            请假申请
                        </div>
                    </Link>
                    <Link href="/cancel_leave" passHref>
                        <div className="block text-white hover:bg-gray-700 px-4 py-2 items-center cursor-pointer">
                            <FaSignOutAlt className="mr-2" />
                            销假申请
                        </div>
                    </Link>
                    <Link href="/overview" passHref>
                        <div className="block text-white hover:bg-gray-700 px-4 py-2 items-center cursor-pointer">
                            <FaClipboardList className="mr-2" />
                            信息总览
                        </div>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;