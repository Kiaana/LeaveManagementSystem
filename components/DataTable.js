// components/DataTable.js
import { FaSpinner } from 'react-icons/fa';
import { memo } from 'react';

const DataTable = ({ columns, data, loading, emptyMessage }) => {
  // 状态样式映射
  const statusStyles = {
    current: {
      bg: 'bg-blue-50',
      border: 'border-l-4 border-l-blue-500',
      text: 'text-blue-700'
    },
    cancelled: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-l-green-500',
      text: 'text-green-700'
    },
    overdue: {
      bg: 'bg-red-50',
      border: 'border-l-4 border-l-red-500',
      text: 'text-red-700'
    },
    not_started: {
      bg: 'bg-gray-50',
      border: 'border-l-4 border-l-gray-500',
      text: 'text-gray-700'
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    scope="col"
                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${
                      col.hideOnMobile ? 'hidden sm:table-cell' : ''
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y relative">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm">
                      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                    {/* 保持当前数据显示，添加半透明遮罩 */}
                    {data.map((row) => {
                      const statusStyle = statusStyles[row.status] || {};
                      return (
                        <tr
                          key={row.id}
                          className={`group ${statusStyle.bg || ''} ${statusStyle.border || ''}`}
                        >
                          {columns.map((col) => (
                            <td
                              key={col.accessor}
                              className={`px-6 py-3 whitespace-nowrap ${
                                col.hideOnMobile ? 'hidden sm:table-cell' : ''
                              }`}
                            >
                              <div className={`text-sm ${statusStyle.text || 'text-gray-600'} font-medium`}>
                                {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                              </div>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((row) => {
                  const statusStyle = statusStyles[row.status] || {};
                  return (
                    <tr
                      key={row.id}
                      className={`group hover:bg-gray-50 transition-colors duration-200 ${
                        statusStyle.bg || ''
                      } ${statusStyle.border || ''}`}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.accessor}
                          className={`px-6 py-3 whitespace-nowrap ${
                            col.hideOnMobile ? 'hidden sm:table-cell' : ''
                          }`}
                        >
                          <div className={`text-sm ${statusStyle.text || 'text-gray-600'} font-medium`}>
                            {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm">{emptyMessage || '暂无记录'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(DataTable);