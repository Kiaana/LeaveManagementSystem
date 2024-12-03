// pages/room_inspection/details.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  FaCalendarAlt, 
  FaSpinner, 
  FaArrowLeft, 
  FaChevronDown, 
  FaChevronRight,
  FaDoorOpen,
  FaClock,
  FaUser
} from 'react-icons/fa';
import axiosInstance from '../../services/axiosConfig';
import PageTransition from '../../components/PageTransition';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '../../components/ProtectedRoute';

const DetailsContent = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRooms, setExpandedRooms] = useState(new Set());
  const router = useRouter();

  const fetchInspections = async (date) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/room-inspections/by-date', {
        params: { date }
      });
      setInspections(response.data.data);
    } catch (error) {
      console.error('获取检查记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections(selectedDate);
  }, [selectedDate]);

  const toggleRoom = (roomNumber) => {
    setExpandedRooms(prev => {
      const next = new Set(prev);
      if (next.has(roomNumber)) {
        next.delete(roomNumber);
      } else {
        next.add(roomNumber);
      }
      return next;
    });
  };

  const formatTime = (dateString) => {
    try {
      // 创建dayjs对象并获取当地时区偏移量（分钟）
      const localOffset = new Date().getTimezoneOffset();
      
      // 解析原始时间并应用偏移
      const time = dayjs(dateString)
        .subtract(localOffset, 'minute')
        .format('HH:mm');
      
      return time;
    } catch (error) {
      console.error('时间格式化错误:', error);
      return '时间格式错误';
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
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              内务检查详情
            </h1>

            <div className="flex justify-center mb-8">
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-blue-500 text-3xl" />
              </div>
            ) : (
              <div className="space-y-4">
                {inspections.map((room) => (
                  <div key={room.room_number} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleRoom(room.room_number)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FaDoorOpen className="text-gray-400" />
                        <span className="font-medium">{room.room_number} 宿舍</span>
                        <span className={`font-bold ${room.total_score > 0 ? 'text-green-600' : room.total_score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {room.total_score > 0 ? `+${room.total_score}` : room.total_score}
                        </span>
                      </div>
                      {expandedRooms.has(room.room_number) ? (
                        <FaChevronDown className="text-gray-400" />
                      ) : (
                        <FaChevronRight className="text-gray-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedRooms.has(room.room_number) && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 space-y-4">
                            {room.inspections.length > 0 ? (
                              room.inspections.map((inspection) => (
                                <div
                                  key={inspection.id}
                                  className="p-4 bg-gray-50 rounded-lg space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={`font-bold ${inspection.score > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {inspection.score > 0 ? `+${inspection.score}` : inspection.score}
                                    </span>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <FaClock className="mr-1" />
                                      {formatTime(inspection.created_at)}
                                    </div>
                                  </div>
                                  <p className="text-gray-600">{inspection.reason}</p>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <FaUser className="mr-1" />
                                    {inspection.inspector}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-gray-500 py-4">
                                暂无检查记录
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default function DetailsPage() {
  return (
    <ProtectedRoute>
      <DetailsContent />
    </ProtectedRoute>
  );
}