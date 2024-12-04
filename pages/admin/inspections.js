// pages/admin/inspections.js
import { FaTools } from 'react-icons/fa';
import PageTransition from '../../components/PageTransition';
import ProtectedRoute from '../../components/ProtectedRoute';

const InspectionsPage = () => {
  return (
    <ProtectedRoute requiredRole={['admin', 'superadmin']}>
      <PageTransition>
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl shadow-lg p-6">
              <FaTools className="text-6xl text-gray-400 mb-4 animate-pulse" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">开发中...</h1>
              <p className="text-gray-600">此功能正在开发中，敬请期待</p>
            </div>
          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
};

export default InspectionsPage;