// pages/room_inspection/rank.js
import { useState, useEffect } from 'react';
import { FaTrophy, FaSpinner, FaArrowLeft, FaMedal, FaDoorOpen } from 'react-icons/fa';
import { useRouter } from 'next/router';
import axiosInstance from '../../services/axiosConfig';
import PageTransition from '../../components/PageTransition';
import { motion } from 'framer-motion';

const RankingContent = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRankings = async (range) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/dormitories/rankings', {
        params: { range }
      });
      setRankings(response.data.data);
    } catch (error) {
      console.error('获取排名失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(timeRange);
  }, [timeRange]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaMedal className="text-2xl text-yellow-500" />;
      case 2:
        return <FaMedal className="text-2xl text-gray-400" />;
      case 3:
        return <FaMedal className="text-2xl text-amber-600" />;
      default:
        return <span className="text-xl font-bold text-gray-600">{rank}</span>;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-4">
            <button
              onClick={() => router.push('/room_inspection')}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span>返回</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-8">
              <FaTrophy className="text-3xl text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-800">宿舍内务排名</h1>
            </div>

            <div className="flex justify-center mb-8 space-x-4">
              <button
                onClick={() => setTimeRange('today')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === 'today'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                今日排名
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === 'week'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                本周排名
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-blue-500 text-3xl" />
              </div>
            ) : (
              <div className="space-y-4">
                {rankings.map((item) => (
                  <div
                    key={item.dormitory_id}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(item.rank)}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center space-x-2">
                        <FaDoorOpen className="text-gray-400" />
                        <h3 className="font-medium text-lg">{item.room_number} 宿舍</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {item.total_score > 0 ? `+${item.total_score}` : item.total_score}
                      </div>
                      <div className="text-sm text-gray-500">总分</div>
                    </div>
                  </div>
                ))}

                {rankings.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    暂无排名数据
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RankingContent;