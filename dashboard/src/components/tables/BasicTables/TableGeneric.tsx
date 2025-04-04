import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface Record {
  [key: string]: any;
}

interface Header {
  [key: string]: any;
}

interface TableGenericProps {
  records: Record[];
  headers: string[];
}

const TableGeneric: React.FC<TableGenericProps> = ({ records, headers }) => {
  console.table(headers);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {headers.map((item, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {records.map((item, index) => (
              <TableRow key={index}>
                {headers.map((header, i) => (
                  <TableCell key={i} className="px-5 py-4 sm:px-6 text-start">
                    {item[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableGeneric;
