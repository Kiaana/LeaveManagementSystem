// pages/leave_rank.js
import { useState, useEffect } from 'react';
import { FaTrophy, FaSpinner, FaGraduationCap, FaMedal } from 'react-icons/fa';
import axiosInstance from '../services/axiosConfig';
import PageTransition from '../components/PageTransition';
import Pagination from '../components/Pagination';

const RankColors = {
  1: 'text-yellow-500',
  2: 'text-gray-400',
  3: 'text-amber-600'
};

const LeaveRankPage = () => {
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);

  const fetchRankings = async (page) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/leave_rank', {
        params: {
          page,
          per_page: perPage
        }
      });
      setRankings(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('获取排行榜失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(currentPage);
  }, [currentPage]);

  const getRankIcon = (rank) => {
    const rankColor = RankColors[rank] || 'text-gray-600';
    
    switch (rank) {
      case 1:
      case 2:
      case 3:
        return <FaMedal className={`text-2xl ${rankColor}`} />;
      default:
        return <span className={`text-xl font-bold ${rankColor}`}>{rank}</span>;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <FaTrophy className="text-3xl text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-800">请假排行榜</h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-blue-500 text-3xl" />
              </div>
            ) : (
              <div className="space-y-4">
                {rankings.map((item, index) => (
                  <div
                    key={item.user_id}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(item.rank)}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaGraduationCap className="mr-1" />
                          <span>{item.major}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {item.leave_count}
                      </div>
                      <div className="text-sm text-gray-500">请假次数</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LeaveRankPage;