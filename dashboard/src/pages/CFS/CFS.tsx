import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardExtend from "../../components/common/ComponentCardExtend";
import TableGeneric from "../../components/tables/BasicTables/TableGeneric";
import PageMeta from "../../components/common/PageMeta";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../instance/axiosInstance";
import { useLoading } from "../../context/LoadingContext";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import GenericForm from "../Forms/GenericForm";
import { IFormField } from "../../interfaces/interfaces";
import DetailCFS from "./DetailCFS";
import UpdateCFS from "./UpdateCFS";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RobotoRegular } from "../../assets/fonts/RobotoRegular";
interface IRecord {
  [key: string]: any;
}

const CFS = () => {
  // State
  const [cfss, setCfss] = useState<IRecord[]>([]);
  const [isNext, setIsNext] = useState<string | null>(null);
  const [isPrevious, setIsPrevious] = useState<string | null>(null);
  const [statusChangePage, setStatusChangePage] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [cfs, setCFS] = useState<Record<string, any> | null>(null);
  const [triggerDetail, setTriggerDetail] = useState<boolean>(false);
  const [triggerUpdate, setTriggerUpdate] = useState<boolean>(false);
  const [ids, setIds] = useState<string[]>([]);
  const [perPage, setPerPage] = useState<number>(10);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Context
  const { loading, showLoading, hideLoading } = useLoading();
  const { checkRole } = useAuth();

  // Constant
  const NEXT = "next";
  const PREVIOUS = "previous";

  const header = [
    "options",
    "id",
    "ship name",
    "mbl",
    "container number",
    "agency",
    "size",
    "port",
    "eta",
  ];

  const header_visible = [
    "options",
    "id",
    "ship_name",
    "mbl",
    "container_number",
    "agency_name",
    "size",
    "port_name",
    "eta",
  ];

  const handleFormSubmit = async (formData: Record<string, any>) => {
    const validate = handleValidation(formData);
    formData.end_date = checkDateEmpty(formData.end_date);
    formData.actual_date = checkDateEmpty(formData.actual_date);
    if (Object.keys(validate).length === 0) {
      try {
        showLoading();
        const response = await axiosInstance.post("/cfss/", formData);
        if (response.status == 201) {
          alert("Successfully");
          await getList();
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        hideLoading();
      }
    }
  };
  const getList = async (query: string = ""): Promise<void> => {
    showLoading();
    try {
      const url = query
        ? `/cfss/?${query}&page_size=${perPage}`
        : `/cfss/?page_size=${perPage}`;
      const response = await axiosInstance.get(url);
      if (response.data) {
        setCfss(response.data.results);
        setIsPrevious(response.data.previous);
        setIsNext(response.data.next);
        setQuantity(response.data.count);
        setIds([]);
        setStartDate(null);
        setEndDate(null);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      hideLoading();
    }
  };

  const onstatusChangePage = (value: string | any) => {
    setStatusChangePage(value);
  };

  const onChangePage = async () => {
    if (statusChangePage) {
      let url = "";
      if (statusChangePage == NEXT && isNext) {
        url = isNext.split("?")[1] || "";
      } else {
        if (isPrevious) {
          url = isPrevious.split("?")[1] || "";
        }
      }
      setStatusChangePage(null);
      await getList(url);
    }
  };

  const handleSearch = (e: string | null) => {
    setSearch(e);
  };

  const onSearch = async () => {
    if (search) {
      try {
        showLoading();
        await getList(`q=${search}`);
      } catch (err: any) {
        console.error(err);
      } finally {
        hideLoading();
      }
    }
  };

  const handleValidation = (formData: Record<string, any>) => {
    const errors: Record<string, any> = {};
    if (!formData.ship_name) {
      errors.ship_name = "Ship name is empty";
    }
    if (!formData.mbl) {
      errors.mbl = "MBL is empty";
    }
    if (!formData.container_number) {
      errors.container_number = "Container number is empty";
    }
    if (!formData.container_size) {
      errors.container_size = "Container size is empty";
    }
    if (!formData.eta) {
      errors.eta = "ETA is empty";
    }
    if (!formData.port) {
      errors.port = "Port is empty";
    }
    if (!formData.agency) {
      errors.agency = "Agency is empty";
    }
    return errors;
  };

  const checkDateEmpty = (value: Date) => {
    if (!value) {
      return null;
    }
  };

  const features = async (e: string) => {
    if (e == "refresh") {
      try {
        showLoading();
        await getList();
      } catch (err: any) {
        console.error(err);
      } finally {
        hideLoading();
      }
    }
    if (e == "create") {
      openModal();
    }
  };

  const handleDeleteSelected = useCallback(async () => {
    if (ids.length === 0) {
      alert("Please select at least 1 record to export");
      return;
    }
    try {
      showLoading();
      const response = await axiosInstance.post(`/cfss/delete_multiple/`, {
        ids,
      });
      if (response.status == 204) {
        await getList();
        alert(`Delete successfuly`);
      }
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      hideLoading();
    }
  }, [ids, cfss]);

  const handleExportSheet = useCallback(async () => {
    if (ids.length === 0) {
      alert(`Please select at least 1 record to export`);
      return;
    }
    try {
      showLoading();
      // --------------- \\
      const mainTitle = [["CFS"]];

      const currentDate = new Date().toLocaleString("vi-VN");
      const subHeader = [[`Export: ${currentDate}`]];

      const tableHeaders = [
        [
          "ID",
          "SHIP NAME",
          "MBL",
          "CONTAINER NUMBER",
          "AGENCY",
          "TYPE",
          "PORT",
          "ETA",
        ],
      ];

      const tableData = cfss
        .filter((cfs) => {
          if (ids.includes(cfs.id)) {
            return cfs;
          }
        })
        .map((cfs) => [
          cfs.id,
          cfs.ship_name,
          cfs.mbl,
          cfs.container_number,
          cfs.agency_name,
          `${cfs.size} - ${cfs.container_type}`,
          cfs.port_name,
          new Date(cfs.eta).toLocaleDateString("vi-VN"),
        ]);

      const ws = XLSX.utils.aoa_to_sheet([]);

      let currentRow = 0;

      XLSX.utils.sheet_add_aoa(ws, mainTitle, { origin: `A${currentRow + 1}` });
      currentRow += mainTitle.length;

      XLSX.utils.sheet_add_aoa(ws, subHeader, { origin: `A${currentRow + 1}` });
      currentRow += subHeader.length;
      currentRow += 1;

      XLSX.utils.sheet_add_aoa(ws, tableHeaders, {
        origin: `A${currentRow + 1}`,
      });
      currentRow += tableHeaders.length;

      XLSX.utils.sheet_add_aoa(ws, tableData, { origin: `A${currentRow + 1}` });

      const numCols = tableHeaders[0].length;
      if (numCols > 1) {
        const mergeTitle = {
          s: { r: 0, c: 0 },
          e: { r: 0, c: numCols - 1 },
        };
        const mergeSubHeader = {
          s: { r: 1, c: 0 },
          e: { r: 1, c: numCols - 1 },
        };

        ws["!merges"] = ws["!merges"] || [];
        ws["!merges"].push(mergeTitle);
        ws["!merges"].push(mergeSubHeader);
      }

      const colWidths = [
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
      ];
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "CFS");
      XLSX.writeFile(wb, "CFS.xlsx");
    } catch (err) {
      console.error(err);
    } finally {
      hideLoading();
    }
  }, [ids]);

  const handleExportPDF = useCallback(async () => {
    if (ids.length === 0) {
      alert("Please select at least 1 record to export");
      return;
    }
    try {
      showLoading();
      // init PDF instance
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const font = "Roboto";
      (doc as any).addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
      doc.addFont("Roboto-Regular.ttf", font, "normal");
      doc.setFont(font);
      // setup data for table
      const tableColumn = [
        "ID",
        "SHIP NAME",
        "MBL",
        "CONTAINER NUMBER",
        "AGENCY",
        "TYPE",
        "PORT",
        "ETA",
      ];
      const tableRows = cfss
        .filter((cfs) => {
          if (ids.includes(cfs.id)) {
            return cfs;
          }
        })
        .map((cfs) => [
          cfs.id,
          cfs.ship_name,
          cfs.mbl,
          cfs.container_number,
          cfs.agency_name,
          `${cfs.size} - ${cfs.container_type}`,
          cfs.port_name,
          new Date(cfs.eta).toLocaleDateString("vi-VN"),
        ]);
      // Main title
      doc.setFontSize(18);
      doc.text("CFS", 14, 20);
      doc.setFontSize(11);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        bodyStyles: {
          font: font,
        },
      });

      doc.save("CFS.pdf");
    } catch (err) {
      console.error(err);
    } finally {
      hideLoading();
    }
  }, [ids]);

  // Filter eta of cfs from start to end date
  const handleFilterByDateRange = useCallback(async () => {
    if (startDate && endDate) {
      try {
        showLoading();
        const query = `startDate=${startDate}&endDate=${endDate}`;
        console.log(query);
        await getList(query);
      } catch (err) {
        console.error(err);
      } finally {
        hideLoading();
      }
    }
  }, [startDate, endDate]);

  const detailCFS = async (value: string) => {
    if (value) {
      try {
        showLoading();
        const response = await axiosInstance.get(`/cfss/${value}/`);
        if (response.status == 200) {
          setCFS(response.data);
          setTriggerDetail(true);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        hideLoading();
      }
    } else {
      alert(`There is no data to display information for this CFS.`);
    }
  };

  const handleUpdate = async (formData: Record<string, any>) => {
    const validate = handleValidation(formData);
    formData.end_date = checkDateEmpty(formData.end_date);
    formData.actual_date = checkDateEmpty(formData.actual_date);
    if (Object.keys(validate).length === 0) {
      const { id } = formData;
      delete formData.id;

      try {
        showLoading();
        const response = await axiosInstance.patch(`/cfss/${id}/`, formData);
        if (response.status == 200) {
          alert("Updated successfully");
          await getList();
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        hideLoading();
        setTriggerUpdate(false);
      }
    }
  };

  const handleCheckbox = (value: string[]) => {
    const list = [...new Set(value)];
    setIds(list);
  };

  const formField: IFormField[] = [
    {
      name: "ship_name",
      label: "Ship name",
      type: "text",
    },
    {
      name: "mbl",
      label: "MBL",
      type: "text",
    },
    {
      name: "container_number",
      label: "Container number",
      type: "text",
    },
    {
      name: "agency",
      label: "Agency",
      type: "select",
      apiSearch: "/agencies/?q=",
    },
    {
      name: "container_size",
      label: "Container size",
      type: "select",
      apiSearch: "/container-sizes/?q=",
    },
    {
      name: "cbm",
      label: "CBM",
      type: "number",
    },
    {
      name: "eta",
      label: "ETA",
      type: "date",
    },
    {
      name: "port",
      label: "Port",
      type: "select",
      apiSearch: "/ports/?q=",
    },
    {
      name: "actual_date",
      label: "Actual date",
      type: "date",
    },
    {
      name: "end_date",
      label: "End date",
      type: "date",
    },
    {
      name: "note",
      label: "Note",
      type: "text",
      placeholder: "Enter your note",
    },
  ];

  useEffect(() => {
    checkRole();
    getList();
  }, []);

  useEffect(() => {
    onChangePage();
  }, [statusChangePage]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      onSearch();
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      await getList();
    };
    fetchData();
  }, [perPage]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleFilterByDateRange();
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [startDate, endDate, handleFilterByDateRange]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <PageMeta
        title="CFS Table"
        description="This is CFS Table for T.T.P Logistics"
      />
      <PageBreadcrumb pageTitle="CFS" />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="h-screen max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add CFS
            </h4>
          </div>
          <div>
            <GenericForm
              fields={formField}
              onSubmit={handleFormSubmit}
              validationForm={handleValidation}
            />
          </div>
        </div>
        {/* Form at here */}
      </Modal>
      <div className="space-y-6">
        <ComponentCardExtend title="CFS Table" features={features}>
          <TableGeneric
            records={cfss}
            headers={header}
            header_visible={header_visible}
            previous={isPrevious}
            next={isNext}
            quantity={quantity}
            ids={ids}
            perPage={perPage}
            changePage={onstatusChangePage}
            handleSearch={handleSearch}
            recordDetail={detailCFS}
            handleCheckbox={handleCheckbox}
            onDeleteRequest={handleDeleteSelected}
            onExportPDF={handleExportPDF}
            onExportSheet={handleExportSheet}
            setPerPage={setPerPage}
            onStartDate={setStartDate}
            onEndDate={setEndDate}
          />
        </ComponentCardExtend>
      </div>
      {triggerDetail && (
        <DetailCFS
          detail={cfs!}
          setTrigger={setTriggerDetail}
          isUpdate={true}
          setTriggerUpdate={setTriggerUpdate}
        />
      )}
      {triggerUpdate && (
        <UpdateCFS
          cfs={cfs!}
          setTrigger={setTriggerUpdate}
          onUpdate={handleUpdate}
          validationForm={handleValidation}
        />
      )}
    </>
  );
};

export default CFS;
