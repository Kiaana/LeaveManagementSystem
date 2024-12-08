// pages/suggestions/pending.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaSpinner, FaUser, FaEyeSlash, FaReply } from 'react-icons/fa';
import axiosInstance from '../../services/axiosConfig';
import { toast } from 'react-toastify';
import PageTransition from '../../components/PageTransition';
import ProtectedRoute from '../../components/ProtectedRoute';
import Pagination from '../../components/Pagination';
import { formatDate } from '../../utils/dateFormatter';
import Button from '../../components/Button';
import React from 'react';

const PendingSuggestions = () => {
    const router = useRouter();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        total: 0,
        pages: 1,
        current_page: 1,
        per_page: 10
    });

    const fetchSuggestions = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/suggestions/unreplied', {
                params: {
                    page,
                    per_page: 10,
                }
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

    const handleReply = async (id, content) => {
        setActionLoading(true);
        try {
            await axiosInstance.post(`/suggestions/${id}/reply`, {
                reply: content
            });
            toast.success('回复成功');
            fetchSuggestions(pageInfo.current_page);
        } catch (error) {
            toast.error(error.response?.data?.error || '回复失败');
        } finally {
            setActionLoading(false);
        }
    };

    const SuggestionCard = React.memo(({ suggestion, onReply, actionLoading }) => {
        const [isReplying, setIsReplying] = useState(false);
        const [localReplyContent, setLocalReplyContent] = useState('');

        const handleSubmitReply = async () => {
            if (!localReplyContent.trim()) {
                toast.error('请输入回复内容');
                return;
            }
            await onReply(suggestion.id, localReplyContent);
            setIsReplying(false);
            setLocalReplyContent('');
        };

        return (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 mb-4">
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

                {/* 回复区域 */}
                <div className="mt-6">
                    {isReplying ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <textarea
                                    value={localReplyContent}
                                    onChange={(e) => setLocalReplyContent(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 bg-gray-50"
                                    placeholder="请输入回复内容..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        setIsReplying(false);
                                        setLocalReplyContent('');
                                    }}
                                >
                                    取消
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleSubmitReply}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            回复中...
                                        </>
                                    ) : (
                                        '提交回复'
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setIsReplying(true)}
                            className="w-full sm:w-auto"
                        >
                            <FaReply className="mr-2" />
                            回复建议
                        </Button>
                    )}
                </div>
            </div>
        );
    });

    return (
        <ProtectedRoute requiredRole={['干部', '管理员']}>
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
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">待回复建议</h1>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <FaSpinner className="animate-spin text-3xl text-blue-500" />
                            </div>
                        ) : suggestions.length > 0 ? (
                            <div className="space-y-4">
                                {suggestions.map(suggestion => (
                                    <SuggestionCard
                                        key={suggestion.id}
                                        suggestion={suggestion}
                                        onReply={handleReply}
                                        actionLoading={actionLoading}
                                    />
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
                                <p className="text-gray-500">暂无待回复的建议</p>
                            </div>
                        )}
                    </div>
                </div>
            </PageTransition>
        </ProtectedRoute>
    );
};

export default PendingSuggestions;