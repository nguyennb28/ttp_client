import React, { ChangeEvent, FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface SimpleTableProps {
  records: Record<string, any>[];
  // Header for table
  headers: string[];
  // Fields to access object from API response
  fields: string[];
  previous?: string | null;
  next?: string | null;
  quantity?: number;
  ids?: string[];
  perPage?: number | null;
  changePage?: (e: string | null) => void;
}

const SimpleTable: FC<SimpleTableProps> = ({
  records,
  headers,
  fields,
  previous,
  next,
  quantity,
  ids,
  perPage,
  changePage,
}) => {
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {/* <div className="py-3 border-b-1 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
            <div></div>
          </div> */}
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {headers.map((item, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 uppercase"
                  >
                    {/* Account */}
                    {item == "options" ? (
                      <input
                        type="checkbox"
                        id="checkbox-all"
                        aria-label="Select All"
                      />
                    ) : (
                      item
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {records.map((item, index) => (
                <TableRow key={index}>
                  {fields.map((field, i) => (
                    <TableCell
                      key={i}
                      className="px-5, py-4 sm:px-6 text-start"
                    >
                      {field == "options" ? (
                        <input type="checkbox" value={item["id"]} />
                      ) : null}
                      {item[field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default SimpleTable;
