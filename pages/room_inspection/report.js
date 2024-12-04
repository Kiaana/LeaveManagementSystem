// pages/room_inspection/report.js
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaSpinner, FaDoorClosed, FaClipboard, FaStarHalfAlt, FaArrowLeft } from 'react-icons/fa';
import axiosInstance from '../../services/axiosConfig';
import PageTransition from '../../components/PageTransition';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useRouter } from 'next/router';

const ReportContent = () => {
    const { user } = useAuth();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: {
            score: 0,
        }
    });
    const [loading, setLoading] = useState(false);
    const [dormitories, setDormitories] = useState([]);
    const [loadingDorms, setLoadingDorms] = useState(true);
    const router = useRouter();

    const score = watch('score');

    useEffect(() => {
        const fetchDormitories = async () => {
            try {
                const response = await axiosInstance.get('/dormitories');
                setDormitories(response.data);
            } catch (error) {
                console.error('获取宿舍列表失败:', error);
                toast.error('获取宿舍列表失败');
            } finally {
                setLoadingDorms(false);
            }
        };

        fetchDormitories();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post('/room-inspections', {
                ...data,
                inspector: user.name,
                score: parseInt(data.score),
            });
            toast.success('提交成功');
            reset();
        } catch (error) {
            console.error('提交失败:', error);
            toast.error(error.response?.data?.error || '提交失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-white py-8">
                <div className="container max-w-2xl mx-auto px-4">
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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                            内务检查填报
                        </h1>

                        {loadingDorms ? (
                            <div className="flex justify-center">
                                <FaSpinner className="animate-spin text-gray-500 text-3xl" />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <FormField label="宿舍号" icon={FaDoorClosed} error={errors.dormitory_id}>
                                    <select
                                        {...register('dormitory_id', { required: '请选择宿舍' })}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.dormitory_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                            } focus:border-transparent focus:outline-none focus:ring-2`}
                                    >
                                        <option value="">请选择宿舍</option>
                                        {dormitories.map(dorm => (
                                            <option key={dorm.id} value={dorm.id}>
                                                {dorm.room_number}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="分数" icon={FaStarHalfAlt} error={errors.score}>
                                    <input
                                        type="number"
                                        {...register('score', {
                                            required: '请输入分数',
                                            validate: value => !isNaN(value) || '请输入有效的数字'
                                        })}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.score ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                            } focus:border-transparent focus:outline-none focus:ring-2`}
                                    />
                                </FormField>

                                <FormField label="原因" icon={FaClipboard} error={errors.reason}>
                                    <textarea
                                        {...register('reason', {
                                            required: '请输入加/扣分原因',
                                            minLength: {
                                                value: 2,
                                                message: '原因至少2个字符'
                                            },
                                            validate: {
                                                notEmpty: value => value.trim().length >= 2 || '原因不能全为空格且至少2个字符',
                                                notOnlySpaces: value => !/^\s*$/.test(value) || '原因不能全为空格'
                                            }
                                        })}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.reason ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                            } focus:border-transparent focus:outline-none focus:ring-2`}
                                        rows="4"
                                        placeholder="请输入加/扣分原因"
                                    />
                                </FormField>

                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                                    <Button type="submit" disabled={loading} variant="primary">
                                        {loading ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2" />
                                                提交中...
                                            </>
                                        ) : '提交'}
                                    </Button>
                                    <Button type="button" onClick={() => reset()} variant="secondary">
                                        重置
                                    </Button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default function ReportPage() {
    return (
        <ProtectedRoute>
            <ReportContent />
        </ProtectedRoute>
    );
}