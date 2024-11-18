// components/DataTable.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const DataTable = ({ columns, data, loading, emptyMessage }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <FaSpinner className="animate-spin text-gray-500 text-3xl" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      col.hideOnMobile ? 'hidden sm:table-cell' : ''
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((row) => (
                  <motion.tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.4)' }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.accessor}
                        className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 ${
                          col.hideOnMobile ? 'hidden sm:table-cell' : ''
                        }`}
                      >
                        {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-sm text-gray-500 text-center">
                    {emptyMessage || '暂无记录'}
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

export default DataTable;