import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
}) => {
  const generateConsecutivePages = (start: number, end: number) => {
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getPagesForBeginning = () => {
    return [...generateConsecutivePages(1, 4), "...", totalPages];
  };

  const getPagesForEnd = () => {
    return [1, "...", ...generateConsecutivePages(totalPages - 3, totalPages)];
  };

  const getPagesForMiddle = () => {
    return [
      1,
      "...",
      ...generateConsecutivePages(currentPage - 1, currentPage + 1),
      "...",
      totalPages,
    ];
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return generateConsecutivePages(1, totalPages);
    }

    if (currentPage <= 3) {
      return getPagesForBeginning();
    }

    if (currentPage >= totalPages - 2) {
      return getPagesForEnd();
    }

    return getPagesForMiddle();
  };

  if (totalPages <= 1) return null;

  return (
    <>
      {/* Pagination Component */}
      <div className="flex justify-center items-center mt-6 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => {
            const isActive = page === currentPage;
            const isEllipsis = page === "...";

            let pageClass;
            if (isEllipsis) {
              pageClass = "text-gray-400 cursor-default";
            } else if (isActive) {
              pageClass = "bg-blue-500 text-white";
            } else {
              pageClass =
                "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105";
            }

            return (
              <button
                key={
                  typeof page === "number"
                    ? `page-${page}`
                    : `ellipsis-${index}`
                }
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={isEllipsis}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 text-sm font-medium ${pageClass}`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Page Info */}
      {showPageInfo && (
        <div className="text-center text-white text-sm mb-4">
          الصفحة {currentPage} من {totalPages}
        </div>
      )}
    </>
  );
};

PaginationComponent.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showPageInfo: PropTypes.bool,
};

export default PaginationComponent;
