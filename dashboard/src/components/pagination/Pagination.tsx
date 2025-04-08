import React from "react";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

interface PaginationProps {
  previous: string | null;
  next: string | null;
  changePage: (e: string | null) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  previous,
  next,
  changePage,
}) => {
  const changeStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
    changePage(e.currentTarget.value);
  };

  return (
    <>
      <div className="flex w-full border-t-1 p-5 justify-end">
        {/* Previous Button */}
        <button
          type="button"
          className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          value="previous"
          disabled={previous == null ? true : false}
          title={previous == null ? "No data to redirect page" : ""}
          onClick={changeStatus}
        >
          <MdOutlineKeyboardDoubleArrowLeft />
        </button>

        {/* Next Button */}
        <button
          type="button"
          className="flex items-center justify-center px-4 h-10 ms-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          value="next"
          disabled={next == null ? true : false}
          title={next == null ? "No data to redirect page" : ""}
          onClick={changeStatus}
        >
          <MdOutlineKeyboardDoubleArrowRight />
        </button>
      </div>
    </>
  );
};

export default Pagination;
