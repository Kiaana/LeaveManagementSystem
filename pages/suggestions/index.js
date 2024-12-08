// pages/suggestions/index.js
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import {
    FaEdit,
    FaList,
    FaReply,
    FaClipboardList,
} from 'react-icons/fa';
import PageTransition from '../../components/PageTransition';

const SuggestionsPage = () => {
    const { user } = useAuth();

    const menuItems = [
        // 所有用户都能看到的功能
        {
            title: '提交建议',
            description: '提交您的意见和建议',
            icon: FaEdit,
            path: '/suggestions/create',
            color: 'bg-blue-500'
        },
        {
            title: '我的建议',
            description: '查看我提交的建议',
            icon: FaList,
            path: '/suggestions/mine',
            color: 'bg-green-500'
        },
        // 已回复的建议（所有人可见）
        {
            title: '已回复建议',
            description: '查看已得到回复的建议',
            icon: FaClipboardList,
            path: '/suggestions/replied',
            color: 'bg-purple-500'
        },
        // 仅干部和管理员可见
        ...((['干部', '管理员'].includes(user?.role)) ? [{
            title: '回复建议',
            description: '回复用户提交的建议',
            icon: FaReply,
            path: '/suggestions/pending',
            color: 'bg-yellow-500'
        }] : [])
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-white py-4 lg:py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">意见建议</h1>
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

export default SuggestionsPage;