// pages/birthdays.js
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaBirthdayCake } from 'react-icons/fa';
import Calendar from '../components/Calendar';
import BirthdayList from '../components/BirthdayList';
import axiosInstance from '../services/axiosConfig';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import PageTransition from '../components/PageTransition';

dayjs.locale('zh-cn');

const BirthdaysPage = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [birthdayData, setBirthdayData] = useState({
        today: [],
        upcoming: [],
        monthBirthdays: []
    });
    const [loading, setLoading] = useState(true);

    const fetchBirthdays = async (date) => {
        try {
            setLoading(true);
            // 获取当天和未来7天的生日
            const currentResponse = await axiosInstance.get('/birthdays', {
                params: {
                    date: date.format('YYYY-MM-DD'),
                    range: 7
                }
            });

            // 获取当前显示月份的所有生日
            const monthStart = date.startOf('month');
            const monthEnd = date.endOf('month');
            const monthResponse = await axiosInstance.get('/birthdays', {
                params: {
                    date: monthStart.format('YYYY-MM-DD'),
                    range: monthEnd.diff(monthStart, 'days') + 1
                }
            });

            setBirthdayData({
                today: currentResponse.data.today,
                upcoming: currentResponse.data.upcoming,
                monthBirthdays: [...monthResponse.data.today, ...monthResponse.data.upcoming]
            });
        } catch (error) {
            console.error('获取生日信息失败:', error);
        } finally {
            setLoading(false);
        }
    };

  // 当选择的日期改变时重新获取数据
  useEffect(() => {
    fetchBirthdays(selectedDate);
  }, [selectedDate]);

  // 处理日期变化
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

    return (
        <PageTransition>
            <div className="min-h-screen bg-white py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">生日提醒</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* 今日生日 */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <FaBirthdayCake className="h-6 w-6 text-pink-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">今日生日</h2>
                                </div>
                                <BirthdayList
                                    birthdays={birthdayData.today}
                                    loading={loading}
                                    emptyMessage="今天没有人过生日"
                                />
                            </div>

                            {/* 近期生日 */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <FaCalendarAlt className="h-6 w-6 text-blue-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">近期生日</h2>
                                </div>
                                <BirthdayList
                                    birthdays={birthdayData.upcoming}
                                    loading={loading}
                                    emptyMessage="最近一周没有人过生日"
                                />
                            </div>
                        </div>

                        {/* 日历视图 */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <Calendar
                                value={selectedDate}
                                onChange={handleDateChange}
                                birthdays={birthdayData.monthBirthdays} // 修改为使用月度生日数据
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default BirthdaysPage;