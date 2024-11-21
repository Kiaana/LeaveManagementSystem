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
import { Switch } from '@headlessui/react';

// 启用本地化格式插件
dayjs.extend(localizedFormat);

// 定义颜色数组
const DARK_COLORS = ['#4DC9FF', '#FF6384', '#FFCE56', '#36A2EB', '#FF9F40'];
const LIGHT_COLORS = ['#FF7F50', '#FF69B4', '#FFA07A', '#87CEFA', '#32CD32']; // 更鲜艳的颜色

const Dashboard = () => {
    const [statistics, setStatistics] = useState(null);
    const [dutyInfo, setDutyInfo] = useState(null);
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [weather, setWeather] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingDutyInfo, setLoadingDutyInfo] = useState(true);
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

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
        }, 10000); // 每分钟更新时间
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

    // 获取专业进度条的颜色
    const getProgressColor = (percentage) => {
        if (percentage >= 90) return isDarkMode ? 'bg-green-500' : 'bg-green-400';
        if (percentage >= 75) return isDarkMode ? 'bg-blue-500' : 'bg-blue-400';
        if (percentage >= 60) return isDarkMode ? 'bg-yellow-500' : 'bg-yellow-400';
        return isDarkMode ? 'bg-red-500' : 'bg-red-400';
    };

    // 处理主题切换
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // 动态选择图表颜色
    const COLORS_CHART = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <ToastContainer />

            {/* 主题切换开关 */}
            <div className="fixed top-4 right-4 z-50">
                <Switch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    className={`${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'} 
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                    <span className="sr-only">切换主题</span>
                    <span
                        className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'} 
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </Switch>
            </div>

            <div className="container mx-auto py-8">
                {/* 页面顶部标题 */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-center flex items-center justify-center">
                        <FaUserGraduate className={`mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        学员四队
                    </h1>
                </div>

                {/* 顶部信息栏 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* 当前时间 */}
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg flex flex-col items-center transition-colors duration-300`}>
                        <FaClock className={`text-4xl mb-4 animate-pulse ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        <div className="text-xl">{currentTime.format('YYYY年MM月DD日')}</div>
                        <div className="text-2xl font-bold mt-2">{currentTime.format('HH:mm')}</div>
                    </div>

                    {/* 天气信息 */}
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition-colors duration-300`}>
                        {loadingWeather ? (
                            <FaSpinner className="animate-spin text-4xl" />
                        ) : (
                            <>
                                {weather?.weather?.[0]?.icon.startsWith('01') ? (
                                    <FaSun className={`${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} text-6xl mb-2`} />
                                ) : (
                                    <FaCloudRain className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} text-6xl mb-2`} />
                                )}
                                <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weather?.main?.temp}°C</div>
                                <div className={`capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{weather?.weather?.[0]?.description}</div>
                            </>
                        )}
                    </div>

                    {/* 值班信息 */}
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            <FaUserAlt className={`mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> 值班信息
                        </h3>
                        {loadingDutyInfo ? (
                            <FaSpinner className="animate-spin text-3xl mx-auto" />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center">
                                    <FaUserGraduate className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-2xl mb-1`} />
                                    <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{dutyInfo?.duty_officer || '-'}</div>
                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>值班干部</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <FaUserAlt className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} text-2xl mb-1`} />
                                    <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{dutyInfo?.duty_cadre || '-'}</div>
                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>值班员</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <FaCalendarAlt className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-2xl mb-1`} />
                                    <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{dutyInfo?.team_on_duty || '-'}</div>
                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>队值日</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 主要统计数据 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: '全队人数', value: statistics?.overall?.total_students, icon: FaUserGraduate, color: 'text-blue-500' },
                        { label: '当前请假人数', value: statistics?.overall?.current_leave, icon: FaUserAlt, color: 'text-red-500' },
                        { label: '超假人数', value: statistics?.overall?.overdue_leave, icon: FaClock, color: 'text-yellow-500' },
                        { label: '在位人数', value: statistics?.overall?.present_students, icon: FaUserAlt, color: 'text-green-500' },
                    ].map((item, index) => (
                        <div key={index} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg flex items-center transition-colors duration-300`}>
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} ${item.color}`}>
                                <item.icon className="text-2xl" />
                            </div>
                            <div className="ml-4">
                                <div className={`text-gray-400 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}</div>
                                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.value !== undefined ? item.value : '—'}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 图表区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 请假去向分布 */}
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg transition-colors duration-300`} style={{ height: '450px' }}>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            <FaUserGraduate className={`mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} /> 请假去向分布
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
                                            <Cell key={`cell-${index}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />
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
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            <FaUserGraduate className={`mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} /> 专业人数分布
                        </h3>
                        {loadingStats ? (
                            <div className="flex justify-center items-center h-40">
                                <FaSpinner className="animate-spin text-4xl" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                {getMajorChartData().map((major, index) => {
                                    const presentStudents = major.总人数 - major.请假人数;
                                    const percentage = ((presentStudents / major.总人数) * 100).toFixed(1);

                                    return (
                                        <div key={index} className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{major.name}</span>
                                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{percentage}%</span>
                                            </div>
                                            <div className="relative h-2 bg-gray-200 rounded">
                                                <div
                                                    className={`absolute top-0 left-0 h-full rounded ${getProgressColor(percentage)}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                在位：{presentStudents} / 总数：{major.总人数}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;