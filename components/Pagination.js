// components/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-3 py-2 min-w-[80px] text-sm sm:text-base bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
      >
        上一页
      </button>
      <span className="text-sm sm:text-base text-gray-600">
        第 {currentPage} 页 / 共 {totalPages} 页
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-2 min-w-[80px] text-sm sm:text-base bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
      >
        下一页
      </button>
    </div>
  );
};

export default Pagination;