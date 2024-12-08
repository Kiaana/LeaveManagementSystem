// pages/suggestions/create.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FaEdit, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import axiosInstance from '../../services/axiosConfig';
import { toast } from 'react-toastify';
import PageTransition from '../../components/PageTransition';
import FormField from '../../components/FormField';
import Button from '../../components/Button';

const CreateSuggestion = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post('/suggestions', {
                content: data.content,
                is_anonymous: data.is_anonymous
            });
            toast.success('建议提交成功');
            router.push('/suggestions/mine');
        } catch (error) {
            toast.error(error.response?.data?.error || '提交失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-white py-4 lg:py-8">
                <div className="container max-w-2xl mx-auto px-4">
                    <div className="mb-4">
                        <button
                            onClick={() => router.push('/suggestions')}
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            <span>返回</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">提交建议</h1>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField label="建议内容" icon={FaEdit} error={errors.content}>
                                <textarea
                                    {...register('content', {
                                        required: '请输入建议内容',
                                        minLength: {
                                            value: 10,
                                            message: '建议内容至少10个字符'
                                        },
                                        maxLength: {
                                            value: 500,
                                            message: '建议内容不能超过500个字符'
                                        }
                                    })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                                    placeholder="请详细描述您的建议..."
                                />
                            </FormField>

                            {/* <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('is_anonymous')}
                                    id="is_anonymous"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                />
                                <label
                                    htmlFor="is_anonymous"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    匿名提交
                                </label>
                            </div> */}

                            <div className="flex flex-col space-y-3 pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            提交中...
                                        </>
                                    ) : '提交建议'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default CreateSuggestion;