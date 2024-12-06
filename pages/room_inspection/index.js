// pages/room_inspection.js
import {
    FaClipboardCheck,
    FaTrophy,
    FaChartBar,
    FaArrowRight
} from 'react-icons/fa';
import Link from 'next/link';
import PageTransition from '../../components/PageTransition';
import ProtectedRoute from '../../components/ProtectedRoute';
import axiosInstance from '../../services/axiosConfig';
import { useEffect, useState } from 'react';


const RoomInspection = () => {
    const [statistics, setStatistics] = useState({
        positive_dorms_count: 0,
        negative_dorms_count: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axiosInstance.get('/dormitories/statistics', {
                    params: { range: 'today' }
                });
                setStatistics(response.data.statistics);
            } catch (error) {
                console.error('获取统计数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);
    const menuItems = [
        {
            title: '内务情况填报',
            description: '记录和提交宿舍内务检查情况',
            icon: FaClipboardCheck,
            path: '/room_inspection/report',
            color: 'bg-blue-500'
        },
        {
            title: '内务排名',
            description: '查看各宿舍内务评分排名情况',
            icon: FaTrophy,
            path: '/room_inspection/rank',
            color: 'bg-yellow-500'
        },
        {
            title: '内务详情',
            description: '查看历史内务检查记录及统计',
            icon: FaChartBar,
            path: '/room_inspection/details',
            color: 'bg-green-500'
        }
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-white py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        宿舍内务检查系统
                    </h1>

                    {/* 功能卡片区 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className="block"
                            >
                                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                    <div className={`inline-flex p-3 rounded-lg ${item.color} text-white mb-4`}>
                                        <item.icon className="text-2xl" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                                        {item.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center text-blue-500 font-medium">
                                        <span>查看详情</span>
                                        <FaArrowRight className="ml-2" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* 统计概览区 */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            今日检查概览
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="text-green-500 text-sm font-medium">
                                    加分宿舍
                                </div>
                                <div className="text-2xl font-bold text-gray-800 mt-1">
                                    {loading ? (
                                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                                    ) : (
                                        `${statistics.positive_dorms_count} 间`
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                                <div className="text-red-500 text-sm font-medium">
                                    扣分宿舍
                                </div>
                                <div className="text-2xl font-bold text-gray-800 mt-1">
                                    {loading ? (
                                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                                    ) : (
                                        `${statistics.negative_dorms_count} 间`
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default function RoomInspectionPage() {
    return (
        <ProtectedRoute>
            <RoomInspection />
        </ProtectedRoute>
    );
}