import { useState, useEffect } from 'react';

const Pagination = ({ items, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    onPageChange(currentItems);
  }, [currentPage, items, itemsPerPage, onPageChange]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 rounded-md shadow-md hover:bg-gray-400"
      >
        Previous
      </button>
      <span className="text-lg">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 rounded-md shadow-md hover:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
