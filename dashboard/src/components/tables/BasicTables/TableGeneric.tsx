import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { FiBox } from "react-icons/fi";
import Pagination from "../../pagination/Pagination";

interface Record {
  [key: string]: any;
}

interface TableGenericProps {
  records: Record[];
  headers: string[];
  header_visible: string[];
  previous: string | null;
  next: string | null;
  quantity: number;
  changePage: (e: string | null) => void;
  handleSearch: (e: string | null) => void;
}

const TableGeneric: React.FC<TableGenericProps> = ({
  records,
  headers,
  header_visible,
  previous,
  next,
  quantity,
  changePage,
  handleSearch,
}) => {
  // Q is query
  const onQ = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.currentTarget.value);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        {/* Search and filter */}
        <div className="py-3 border-b-1 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 dark:text-gray-400"> Show </span>
            <div className="relative z-20 bg-transparent">
              <select
                name=""
                id=""
                className="dark:bg-dark-900 h-9 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none py-2 pl-3 pr-8 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                disabled
              >
                <option
                  value="10"
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  20
                </option>
              </select>
              <span className="absolute right-2 top-1/2 z-30 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400"> entries </span>
          </div>
          <div className="relative">
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill=""
                ></path>
              </svg>
            </button>

            <input
              type="text"
              placeholder="Search..."
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
              onChange={onQ}
            />
          </div>
        </div>
        <Table className="overflow-scroll h-100">
          {quantity > 0 ? (
            <>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {headers.map((item, index) => (
                    <TableCell
                      key={index}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 uppercase"
                    >
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {records.map((item, index) => (
                  <TableRow key={index}>
                    {header_visible.map((header, i) => (
                      <TableCell
                        key={i}
                        className="px-5 py-4 sm:px-6 text-start"
                      >
                        {item[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <>
              <TableBody className="">
                <TableRow>
                  <TableCell className="">
                    <div className="flex flex-col w-full items-center">
                      <FiBox className="size-20 block" />
                      <p>No records</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </>
          )}
        </Table>
      </div>
      <div className="flex items-center justify-between border-t-1">
        {/* Quantity */}
        <div className="p-5">
          <p className="text-gray-500">
            Number of records: <span>{quantity}</span>
          </p>
        </div>
        {/* Pagination */}
        <Pagination previous={previous} next={next} changePage={changePage} />
      </div>
    </div>
  );
};

export default TableGeneric;
