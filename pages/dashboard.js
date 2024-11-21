// pages/dashboard.js
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../services/axiosConfig';
import {
    FaSpinner,
    FaSun,
    FaCloudRain,
    FaUserAlt,
    FaUserGraduate,
    FaClock,
    FaCalendarAlt,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from 'recharts';

// 启用本地化格式插件
dayjs.extend(localizedFormat);

// 定义颜色数组
const COLORS = ['#4DC9FF', '#FF6384', '#FFCE56', '#36A2EB', '#FF9F40'];

const Dashboard = () => {
    const [statistics, setStatistics] = useState(null);
    const [dutyInfo, setDutyInfo] = useState(null);
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [weather, setWeather] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingDutyInfo, setLoadingDutyInfo] = useState(true);
    const [loadingWeather, setLoadingWeather] = useState(true);

    // 为每个请求创建独立的 isFetching 引用
    const isFetchingStats = useRef(false);
    const isFetchingDutyInfo = useRef(false);
    const isFetchingWeather = useRef(false);

    // 通用的防抖函数，接收一个 useRef 引用
    const fetchWithDebounce = async (fetchFunction, isFetchingRef) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        try {
            await fetchFunction();
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            isFetchingRef.current = false;
        }
    };

    // 实时更新时间
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 60000); // 每分钟更新时间
        return () => clearInterval(interval);
    }, []);

    // 获取数据
    useEffect(() => {
        // 初始加载
        fetchWithDebounce(fetchStatistics, isFetchingStats);
        fetchWithDebounce(fetchDutyInfo, isFetchingDutyInfo);
        fetchWithDebounce(fetchWeather, isFetchingWeather);

        // 定时更新数据，每 30 秒请求一次
        const statsInterval = setInterval(() => {
            fetchWithDebounce(fetchStatistics, isFetchingStats);
        }, 30000);

        const dutyInfoInterval = setInterval(() => {
            fetchWithDebounce(fetchDutyInfo, isFetchingDutyInfo);
        }, 30000);

        const weatherInterval = setInterval(() => {
            fetchWithDebounce(fetchWeather, isFetchingWeather);
        }, 30000);

        return () => {
            clearInterval(statsInterval);
            clearInterval(dutyInfoInterval);
            clearInterval(weatherInterval);
        };
    }, []);

    // 获取统计信息
    const fetchStatistics = async () => {
        try {
            const res = await axiosInstance.get('/statistics');
            setStatistics(res.data);
        } catch (error) {
            toast.error('获取统计信息失败');
        } finally {
            setLoadingStats(false);
        }
    };

    // 获取值班信息
    const fetchDutyInfo = async () => {
        try {
            const res = await axiosInstance.get('/duty_info');
            setDutyInfo(res.data);
        } catch (error) {
            toast.error('获取值班信息失败');
        } finally {
            setLoadingDutyInfo(false);
        }
    };

    // 获取天气信息
    const fetchWeather = async () => {
        try {
            // 这里可以集成真实的天气API
            // 示例数据：
            setWeather({
                main: { temp: 25 },
                weather: [{ description: '晴', icon: '01d' }],
            });
        } catch (error) {
            toast.error('获取天气信息失败');
        } finally {
            setLoadingWeather(false);
        }
    };

    // 处理请假去向分布图表数据
    const getDestinationChartData = () => {
        if (!statistics?.by_destination?.current_leave) return [];
        return [
            { name: '三号院内', value: statistics.by_destination.current_leave['三号院内'] || 0 },
            { name: '一号院', value: statistics.by_destination.current_leave['一号院'] || 0 },
            { name: '921医院', value: statistics.by_destination.current_leave['921医院'] || 0 },
            { name: '其他', value: statistics.by_destination.current_leave['其他'] || 0 },
        ];
    };

    // 处理专业人数分布图表数据
    const getMajorChartData = () => {
        if (!statistics?.by_major) return [];
        return Object.keys(statistics.by_major.total_students).map(major => ({
            name: major,
            总人数: statistics.by_major.total_students[major],
            请假人数: statistics.by_major.current_leave[major] || 0,
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <ToastContainer />
            <div className="container mx-auto py-8 px-4">
                {/* 页面顶部标题 */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-center flex items-center justify-center">
                        <FaUserGraduate className="mr-2 text-yellow-400" />
                        学员四队
                    </h1>
                </div>

                {/* 顶部信息栏 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* 当前时间 */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
                        <FaClock className="text-4xl mb-4 animate-pulse text-yellow-400" />
                        <div className="text-2xl font-semibold">当前时间</div>
                        <div className="text-lg mt-2">{currentTime.format('YYYY年MM月DD日 HH:mm')}</div>
                    </div>

                    {/* 天气信息 */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
                        {loadingWeather ? (
                            <FaSpinner className="animate-spin text-4xl" />
                        ) : (
                            <>
                                {weather?.weather?.[0]?.icon.startsWith('01') ? (
                                    <FaSun className="text-yellow-400 text-6xl mb-2" />
                                ) : (
                                    <FaCloudRain className="text-blue-400 text-6xl mb-2" />
                                )}
                                <div className="text-3xl font-bold">{weather?.main?.temp}°C</div>
                                <div className="text-gray-400 capitalize">{weather?.weather?.[0]?.description}</div>
                            </>
                        )}
                    </div>

                    {/* 值班信息 */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <FaUserAlt className="mr-2" /> 值班信息
                        </h3>
                        {loadingDutyInfo ? (
                            <FaSpinner className="animate-spin text-3xl mx-auto" />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center">
                                    <FaUserGraduate className="text-blue-400 text-2xl mb-1" />
                                    <div className="text-lg font-semibold">{dutyInfo?.duty_officer || '-'}</div>
                                    <div className="text-gray-400 text-sm">值班干部</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <FaUserAlt className="text-green-400 text-2xl mb-1" />
                                    <div className="text-lg font-semibold">{dutyInfo?.duty_cadre || '-'}</div>
                                    <div className="text-gray-400 text-sm">值班员</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <FaCalendarAlt className="text-purple-400 text-2xl mb-1" />
                                    <div className="text-lg font-semibold">{dutyInfo?.team_on_duty || '-'}</div>
                                    <div className="text-gray-400 text-sm">队值日</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 主要统计数据 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: '全队人数', value: statistics?.overall?.total_students, icon: FaUserGraduate, color: 'text-blue-400' },
                        { label: '当前请假人数', value: statistics?.overall?.current_leave, icon: FaUserAlt, color: 'text-red-400' },
                        { label: '超假人数', value: statistics?.overall?.overdue_leave, icon: FaClock, color: 'text-yellow-400' },
                        { label: '在位人数', value: statistics?.overall?.present_students, icon: FaUserAlt, color: 'text-green-400' },
                    ].map((item, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center">
                            <div className={`p-3 rounded-full bg-gray-700 ${item.color}`}>
                                <item.icon className="text-2xl" />
                            </div>
                            <div className="ml-4">
                                <div className="text-gray-400">{item.label}</div>
                                <div className="text-2xl font-bold">{item.value !== undefined ? item.value : '—'}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 图表区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 请假去向分布 */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg" style={{ height: '450px' }}>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <FaUserGraduate className="mr-2" /> 请假去向分布
                        </h3>
                        {loadingStats ? (
                            <div className="flex justify-center items-center h-full">
                                <FaSpinner className="animate-spin text-4xl" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={getDestinationChartData()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}人`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {getDestinationChartData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value}人`, `${name}`]} />
                                    {/* 移除图例 */}
                                    {/* <Legend verticalAlign="bottom" height={36} /> */}
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* 专业人数分布 */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg" style={{ height: '450px' }}>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <FaUserGraduate className="mr-2" /> 专业人数分布
                        </h3>
                        {loadingStats ? (
                            <div className="flex justify-center items-center h-full">
                                <FaSpinner className="animate-spin text-4xl" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={getMajorChartData()}
                                    layout="vertical"
                                    margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis type="category" dataKey="name" />
                                    <Tooltip formatter={(value, name) => [`${value}人`, name === "总人数" ? "总人数" : "请假人数"]} />
                                    {/* 调整图例位置和样式 */}
                                    <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: '20px' }} />
                                    <Bar dataKey="总人数" fill="#82ca9d" />
                                    <Bar dataKey="请假人数" fill="#ff7f50" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;