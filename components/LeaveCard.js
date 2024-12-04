// components/LeaveCard.js
import { FaGlobe, FaUserCheck } from 'react-icons/fa';
import Button from './Button';
import { formatDate } from '../utils/dateFormatter';

export const LeaveCard = ({ data, onCancelLeave, actionLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 relative">
      {/* 标题行 */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{data.user?.name || '-'}</h3>
          <p className="text-sm text-gray-600">{data.user?.major || '-'}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          data.status === 'current' ? 'bg-blue-100 text-blue-800' :
          data.status === 'overdue' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {data.status === 'current' ? '请假中' :
           data.status === 'overdue' ? '已超假' :
           data.status === 'not_started' ? '未开始' : data.status}
        </span>
      </div>

      {/* 详细信息 */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">请假类型</span>
          <span>{data.leave_type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">目的地</span>
          <span>{data.destination}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">开始时间</span>
          <span>{formatDate(data.start_time, 'datetime')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">预计返回</span>
          <span>{formatDate(data.expected_return_time, 'datetime')}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <Button
          onClick={() => onCancelLeave(data.id, '线上销假')}
          variant="info"
          size="sm"
          className="flex-1"
          disabled={actionLoading || data.status === 'not_started'}
        >
          <FaGlobe className="mr-1" />
          线上销假
        </Button>
        <Button
          onClick={() => onCancelLeave(data.id, '当面销假')}
          variant="success"
          size="sm"
          className="flex-1"
          disabled={actionLoading || data.status === 'not_started'}
        >
          <FaUserCheck className="mr-1" />
          当面销假
        </Button>
      </div>
    </div>
  );
};