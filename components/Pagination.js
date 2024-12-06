// components/Pagination.js
import React from 'react';
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange, loading = false }) => {
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

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // 最多显示的页码按钮数量

    if (totalPages <= maxPagesToShow) {
      // 如果总页数小于等于最大显示页数，全部显示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage;
      let endPage;

      if (currentPage <= 3) {
        // 当前页接近开头
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        // 当前页接近结尾
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        // 当前页在中间
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }

      // 添加第一页
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('ellipsis-start'); // 使用唯一标识符作为 key
        }
      }

      // 添加中间页码
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // 添加最后一页
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsis-end'); // 使用唯一标识符作为 key
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const renderPageButton = (pageNumber) => {
    const isActive = currentPage === pageNumber;
    return (
      <button
        key={pageNumber}
        onClick={() => onPageChange(pageNumber)}
        disabled={loading}
        className={`hidden sm:flex items-center justify-center h-8 w-8 rounded-lg ${isActive
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
      >
        {pageNumber}
      </button>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || loading}
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          <FaAngleLeft className="text-sm sm:mr-1" />
          {/* <span className="hidden sm:inline">上一页</span> */}
        </button>

        {/* 桌面端页码显示 */}
        <div className="hidden sm:flex items-center space-x-2">
          {getPageNumbers().map((page, index) => {
            if (typeof page === 'number') {
              return renderPageButton(page);
            } else if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <span key={page + index} className="text-gray-500">
                  ...
                </span>
              );
            } else {
              return null;
            }
          })}
        </div>

        {/* 移动端页码显示 */}
        <span className="sm:hidden text-sm text-gray-600">
          第 {currentPage} 页 / 共 {totalPages} 页
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || loading}
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          {/* <span className="hidden sm:inline">下一页</span> */}
          <FaAngleRight className="text-sm sm:ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;