import React from "react";

const Pagination = ({ page, pages, onPageChange }) => {
  return (
    <div className="flex gap-2 justify-center mt-6">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 border rounded ${page === i + 1 ? "font-bold bg-indigo-100" : ""}`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
