// pages/suggestions/replied.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaSpinner, FaUser, FaEyeSlash, FaReply } from 'react-icons/fa';
import axiosInstance from '../../services/axiosConfig';
import { toast } from 'react-toastify';
import PageTransition from '../../components/PageTransition';
import Pagination from '../../components/Pagination';
import { formatDate } from '../../utils/dateFormatter';

const RepliedSuggestions = () => {
    const router = useRouter();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState({
        total: 0,
        pages: 1,
        current_page: 1,
        per_page: 10
    });

    const fetchSuggestions = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/suggestions/replied', {
                params: { page, per_page: 10 }
            });
            setSuggestions(response.data.data);
            setPageInfo({
                total: response.data.total,
                pages: response.data.pages,
                current_page: response.data.current_page,
                per_page: response.data.per_page
            });
        } catch (error) {
            toast.error('获取建议列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const SuggestionCard = ({ suggestion }) => (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4">
            {/* 建议内容 */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`flex items-center ${suggestion.is_anonymous ? 'text-gray-500' : 'text-gray-700'}`}>
                            {suggestion.is_anonymous ? (
                                <>
                                    <FaEyeSlash className="mr-1.5" />
                                    <span className="font-medium">匿名用户</span>
                                </>
                            ) : (
                                <>
                                    <FaUser className="mr-1.5" />
                                    <span className="font-medium">{suggestion.user?.name}</span>
                                </>
                            )}
                        </div>
                        <span className="text-sm text-gray-500">
                            {formatDate(suggestion.created_at, 'datetime')}
                        </span>
                    </div>
                </div>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                    {suggestion.content}
                </p>
            </div>

            {/* 回复内容 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                        <FaReply className="mr-2 text-blue-500" />
                        <span className="font-medium">回复</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 leading-relaxed mb-3">{suggestion.reply}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                                <FaUser className="mr-1.5" />
                                <span className="font-medium">{suggestion.replier?.name}</span>
                            </div>
                            <span>{formatDate(suggestion.reply_at, 'datetime')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <PageTransition>
            <div className="min-h-screen bg-white py-4 lg:py-8">
                <div className="container max-w-3xl mx-auto px-4">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-full flex justify-between mb-4">
                            <button
                                onClick={() => router.push('/suggestions')}
                                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
                            >
                                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                <span>返回</span>
                            </button>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">已回复建议</h1>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <FaSpinner className="animate-spin text-3xl text-blue-500" />
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="space-y-4">
                            {suggestions.map(suggestion => (
                                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                            ))}
                            {pageInfo.pages > 1 && (
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={pageInfo.current_page}
                                        totalPages={pageInfo.pages}
                                        onPageChange={(page) => fetchSuggestions(page)}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white border border-gray-100 rounded-lg">
                            <p className="text-gray-500">暂无已回复的建议</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default RepliedSuggestions;