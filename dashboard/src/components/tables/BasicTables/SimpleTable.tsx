import React, { ChangeEvent, FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Pagination from "../../pagination/Pagination";

interface SimpleTableProps {
  records: Record<string, any>[];
  // Header for table
  headers: string[];
  // Fields to access object from API response
  fields: string[];
  previous: string | null;
  next: string | null;
  quantity?: number;
  ids?: string[];
  perPage?: number | null;
  changePage: (e: string | null) => void;
  handleCheckbox?: (e: string[]) => void;
  handleUpdate?: (e: boolean, id: string) => void;
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
  handleCheckbox,
  handleUpdate,
}) => {
  const allIds = records.map((record) => record.id);

  const handleSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      handleCheckbox!(allIds);
    } else {
      handleCheckbox!([]);
    }
  };

  const arraysEqualIgnoreOrder = (arr1: string[], arr2: string[]) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    for (let i = 0; i < sorted1.length; i++) {
      if (sorted1[i] !== sorted2[i]) {
        return false;
      }
    }
    return true;
  };

  const handleRecordCheckboxChange = (id: string) => {
    const checkboxAll = document.getElementById(
      "checkbox-all"
    ) as HTMLInputElement | null;

    let newIds: string[];

    if (ids?.includes(id)) {
      newIds = ids.filter((item) => item != id);
    } else {
      newIds = [...(ids ?? []), id];
    }
    handleCheckbox!(newIds);
    if (arraysEqualIgnoreOrder(allIds, newIds)) {
      if (checkboxAll) {
        checkboxAll.checked = true;
      }
    } else {
      if (checkboxAll) {
        checkboxAll.checked = false;
      }
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
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
                        onChange={handleSelectAllChange}
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
                        <input
                          type="checkbox"
                          value={item["id"]}
                          checked={ids?.includes(item.id)}
                          onChange={() => handleRecordCheckboxChange(item.id)}
                          className="checkbox-cell"
                          aria-label={`Select ${item.id}`}
                        />
                      ) : field == "id" ? (
                        // Open model update when click id field
                        <a
                          className="text-sky-500 underline cursor-pointer hover:text-pink-300"
                          // onClick={() => handleUpdate(true, item["id"])}
                          onClick={() => {
                            if (handleUpdate) {
                              handleUpdate(true, item["id"]);
                            }
                          }}
                        >
                          {item[field]}
                        </a>
                      ) : (
                        item[field]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between boorder-t-1">
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
    </>
  );
};

export default SimpleTable;
