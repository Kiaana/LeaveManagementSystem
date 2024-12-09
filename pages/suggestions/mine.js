// pages/suggestions/mine.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaSpinner, FaClock, FaCheck, FaUser, FaEyeSlash, FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../services/axiosConfig';
import { toast } from 'react-toastify';
import PageTransition from '../../components/PageTransition';
import Pagination from '../../components/Pagination';
import { formatDate } from '../../utils/dateFormatter';
import Button from '../../components/Button';

const MineSuggestions = () => {
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
            const response = await axiosInstance.get('/suggestions/mine', {
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

    const SuggestionCard = ({ suggestion }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editContent, setEditContent] = useState(suggestion.content);
        const [editAnonymous, setEditAnonymous] = useState(suggestion.is_anonymous);
        const [actionLoading, setActionLoading] = useState(false);

        const handleEdit = async () => {
            if (!editContent.trim()) {
                toast.error('请输入建议内容');
                return;
            }

            setActionLoading(true);
            try {
                await axiosInstance.put(`/suggestions/${suggestion.id}`, {
                    content: editContent,
                    is_anonymous: editAnonymous
                });
                toast.success('修改成功');
                setIsEditing(false);
                fetchSuggestions(pageInfo.current_page);
            } catch (error) {
                toast.error(error.response?.data?.error || '修改失败');
            } finally {
                setActionLoading(false);
            }
        };

        const handleDelete = async () => {
            setActionLoading(true);
            try {
                await axiosInstance.delete(`/suggestions/${suggestion.id}`);
                toast.success('删除成功');
                fetchSuggestions(pageInfo.current_page);
            } catch (error) {
                toast.error(error.response?.data?.error || '删除失败');
            } finally {
                setActionLoading(false);
            }
        };

        return (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4 hover:shadow-md transition-shadow">
                {isEditing ? (
                    <div className="space-y-4">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                            placeholder="请输入建议内容..."
                        />
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`anonymous-${suggestion.id}`}
                                checked={editAnonymous}
                                onChange={(e) => setEditAnonymous(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`anonymous-${suggestion.id}`} className="ml-2 text-sm text-gray-700">
                                匿名提交
                            </label>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(suggestion.content);
                                    setEditAnonymous(suggestion.is_anonymous);
                                }}
                            >
                                取消
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleEdit}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        保存中...
                                    </>
                                ) : '保存修改'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            <p className="text-gray-800 whitespace-pre-line">{suggestion.content}</p>
                            {!suggestion.reply && (
                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <FaEdit className="mr-1" />
                                        修改
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={handleDelete}
                                        disabled={actionLoading}
                                    >
                                        <FaTrash className="mr-1" />
                                        删除
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
                {/* 建议内容 */}
                {/* <div className="mb-4">
                    <p className="text-gray-800 whitespace-pre-line">{suggestion.content}</p>
                </div> */}

                {/* meta信息 */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            {suggestion.is_anonymous ? (
                                <FaEyeSlash className="mr-1" />
                            ) : (
                                <FaUser className="mr-1" />
                            )}
                            {suggestion.is_anonymous ? '匿名' : '实名'}
                        </span>
                        <span>{formatDate(suggestion.created_at, 'datetime')}</span>
                    </div>
                    <span className={`flex items-center ${suggestion.reply ? 'text-green-500' : 'text-gray-500'
                        }`}>
                        {suggestion.reply ? (
                            <FaCheck className="mr-1" />
                        ) : (
                            <FaClock className="mr-1" />
                        )}
                        {suggestion.reply ? '已回复' : '待回复'}
                    </span>
                </div>

                {/* 回复内容 */}
                {suggestion.reply && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">回复：</h4>
                        <div className="bg-gray-50 rounded p-3">
                            <p className="text-gray-800">{suggestion.reply}</p>
                            <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                                <span>回复人：{suggestion.replier?.name || '未知'}</span>
                                <span>{formatDate(suggestion.reply_at, 'datetime')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-white py-4 lg:py-8">
                <div className="container max-w-3xl mx-auto px-4">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-full flex justify-between mb-4">
                            <button
                                onClick={() => router.push('/suggestions')}
                                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <FaArrowLeft className="mr-2" />
                                <span>返回</span>
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">我的建议</h1>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <FaSpinner className="animate-spin text-3xl text-blue-500" />
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {suggestions.map(suggestion => (
                                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                                ))}
                            </div>
                            {pageInfo.pages > 1 && (
                                <div className="mt-6">
                                    <Pagination
                                        currentPage={pageInfo.current_page}
                                        totalPages={pageInfo.pages}
                                        onPageChange={(page) => fetchSuggestions(page)}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white border border-gray-100 rounded-lg">
                            <p className="text-gray-500">暂无建议记录</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default MineSuggestions;