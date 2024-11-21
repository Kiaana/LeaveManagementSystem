// pages/major_overview.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { FaSpinner, FaUserGraduate, FaSearch, FaGripHorizontal, FaList } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import { useRouter } from 'next/router';

// 防止重复触发 API 请求的防抖工具
let isFetching = false;
const fetchWithDebounce = async (fetchFunction) => {
  if (isFetching) return;
  isFetching = true;
  try {
    await fetchFunction();
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    isFetching = false;
  }
};

// MajorCard 组件优化，使用 React.memo 避免不必要的重新渲染
const MajorCard = React.memo(({ data, animate = true, onClick }) => {
  const percentage = data.totalStudents
    ? ((data.presentStudents / data.totalStudents) * 100).toFixed(1)
    : 0;

  const getStatusColor = (percent) => {
    if (percent >= 90) return 'bg-green-500';
    if (percent >= 75) return 'bg-blue-500';
    if (percent >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const cardContent = (
    <div
      className="bg-white rounded-xl shadow-lg p-6 h-full cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => onClick && onClick(data.major)}
    >
      <div className="flex flex-col h-full">
        {/* 专业名称头部 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{data.major}</h3>
          <FaUserGraduate className="text-gray-500 text-xl" />
        </div>

        {/* 统计数据 */}
        <div className="flex-grow">
          <div className="space-y-4">
            {/* 进度条 */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                    在位率
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getStatusColor(
                    percentage
                  )}`}
                />
              </div>
            </div>

            {/* 详细数据 */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">在位人数</p>
                <p className="text-xl font-bold text-blue-600">{data.presentStudents}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">总人数</p>
                <p className="text-xl font-bold text-gray-600">{data.totalStudents}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return animate ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      {cardContent}
    </motion.div>
  ) : (
    <div className="h-full">{cardContent}</div>
  );
});

const MajorOverview = () => {
  const [majorData, setMajorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const router = useRouter();

  useEffect(() => {
    fetchMajorStatistics();

    // 每 30 秒刷新一次数据
    const interval = setInterval(() => {
      fetchWithDebounce(fetchMajorStatistics);
    }, 30000);

    return () => clearInterval(interval); // 清除定时器
  }, []);

  // 获取专业统计数据
  const fetchMajorStatistics = async () => {
    try {
      const res = await axiosInstance.get('/statistics');
      const { by_major } = res.data;

      const majors = Object.keys(by_major.total_students);
      const data = majors.map((major) => {
        const totalStudents = by_major.total_students[major] || 0;
        const currentLeave = by_major.current_leave[major] || 0;
        const presentStudents = totalStudents - currentLeave;

        return {
          major,
          totalStudents,
          presentStudents,
        };
      });

      // 按专业名称排序
      data.sort((a, b) => a.major.localeCompare(b.major));
      setMajorData(data);
    } catch (error) {
      console.error('Error fetching major statistics:', error);
      toast.error('获取专业统计信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理专业卡片点击事件
  const handleMajorClick = (major) => {
    router.push(`/major/${encodeURIComponent(major)}`);
  };

  const overallStats = majorData.reduce(
    (acc, curr) => {
      acc.totalStudents += curr.totalStudents;
      acc.presentStudents += curr.presentStudents;
      return acc;
    },
    { totalStudents: 0, presentStudents: 0 }
  );

  const filteredMajorData = majorData.filter((item) =>
    item.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">专业在位统计</h1>
        </motion.div>

        {/* 总体统计卡片 */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4">
              <p className="text-gray-600 mb-2">总在位人数</p>
              <p className="text-3xl font-bold text-blue-600">
                {loading ? <FaSpinner className="animate-spin inline" /> : overallStats.presentStudents}
              </p>
            </div>
            <div className="text-center p-4">
              <p className="text-gray-600 mb-2">总人数</p>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? <FaSpinner className="animate-spin inline" /> : overallStats.totalStudents}
              </p>
            </div>
          </div>
        </Card>

        {/* 搜索和视图切换 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="搜索专业..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <FaGripHorizontal className="text-lg" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <FaList className="text-lg" />
            </button>
          </div>
        </div>

        {/* 加载状态 */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : (
          // 专业卡片网格
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredMajorData.map((item) => (
              <MajorCard key={item.major} data={item} animate onClick={handleMajorClick} />
            ))}
          </div>
        )}

        {/* 无数据提示 */}
        {!loading && filteredMajorData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">未找到匹配的专业</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default MajorOverview;