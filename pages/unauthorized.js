import { FaExclamationTriangle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';

const Unauthorized = () => {
  const router = useRouter();

return (
    <PageTransition>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <FaExclamationTriangle className="mx-auto text-6xl text-yellow-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">访问被拒绝</h1>
                <p className="text-gray-600 mb-8">
                    抱歉，您没有权限访问此页面。如需访问，请联系管理员获取相应权限。
                </p>
                <div className="flex justify-center">
                    <Button
                        onClick={() => router.push('/')}
                        variant="primary"
                        className="w-full"
                    >
                        返回首页
                    </Button>
                </div>
            </div>
        </div>
    </PageTransition>
);
};

export default Unauthorized;