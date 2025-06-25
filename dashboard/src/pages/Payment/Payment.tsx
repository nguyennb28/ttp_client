import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardExtend from "../../components/common/ComponentCardExtend";
import TableGeneric from "../../components/tables/BasicTables/TableGeneric";
import PageMeta from "../../components/common/PageMeta";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../instance/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import GenericForm from "../Forms/GenericForm";
import { IFormField } from "../../interfaces/interfaces";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RobotoRegular } from "../../assets/fonts/RobotoRegular";

interface IRecord {
  [key: string]: any;
}

const Payment = () => {
  // State
  const [payments, setPayments] = useState<IRecord[]>([]);
  const [isNext, setIsNext] = useState<string | null>(null);
  const [isPrevious, setIsPrevious] = useState<string | null>(null);
  const [perPage, setPerPage] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(0);
  const [ids, setIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const [statusChangePage, setStatusChangePage] = useState<string | null>(null);
  const { closeModal } = useModal();

  // Context
  const { checkRole, checkAuth, callRefreshToken, countTimeToRefresh } =
    useAuth();
  const { loading, showLoading, hideLoading } = useLoading();

  // Constant
  const NEXT = "next";
  const PREVIOUS = "previous";

  // Header
  const headers = [
    "options",
    "Id",
    "SPC",
    "Bill of Lading Number",
    "Product Name",
    "Employee",
  ];

  const header_visible = [
    "options",
    "id",
    "spc",
    "bln",
    "product_name",
    "employee_name",
  ];

  // Fetch data
  const getList = async (query: string = ""): Promise<void> => {
    showLoading();
    try {
      const url = query
        ? `/payment-document/?${query}&page_size=${perPage}`
        : `/payment-document/?page_size=${perPage}`;
      const response = await axiosInstance.get(url);
      if (response.status == 200) {
        setPayments(response.data.results);
        setIsNext(response.data.next);
        setIsPrevious(response.data.previous);
        setQuantity(response.data.quantity);
        setIds([]);
        setStartDate(null);
        setEndDate(null);
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      hideLoading();
    }
  };

  const onStatusChangePage = (value: string | any) => {
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

  /**
   * Search when user is typing
   *
   * */
  const onSearch = async () => {
    if (search) {
      try {
        showLoading();
        await getList(`q=${search}`);
      } catch (err: any) {
        console.error(err);
        throw err;
      } finally {
        hideLoading();
      }
    }
  };

  /**
   * Filter settlement date from start to end date
   *
   * */
  const handleFilterByDateRange = useCallback(async () => {
    if (startDate && endDate) {
      try {
        showLoading();
        const query = `startDate=${startDate}&endDate=${endDate}`;
        await getList(query);
      } catch (err) {
        throw err;
      } finally {
        hideLoading();
      }
    }
  }, [startDate, endDate]);

  // Feature
  const features = async (e: string) => {
    if (e == "refresh") {
      try {
        showLoading();
        await getList();
      } catch (err: any) {
        console.error(err);
        throw err;
      } finally {
        hideLoading();
      }
    }
    if (e == "create") {
      setIsCreate(true);
    }
    if (e == "update") {
      setIsUpdate(true);
    }
  };

  const closeCreateModal = () => {
    setIsCreate(false);
    // closeModal();
  };

  const closeUpdateModal = () => {
    setIsCreate(false);
    // closeModal();
  };

  useEffect(() => {
    checkRole();
    checkAuth();
    getList();

    const tokenTimeout = setTimeout(() => {
      callRefreshToken();
    }, countTimeToRefresh());
    return () => clearTimeout(tokenTimeout);
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
    // console.log(perPage);
    getList();
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
        title="Payment Table"
        description="This is Payment Table for T.T.P Logistics"
      />
      <PageBreadcrumb pageTitle="Payment" />
      <div className="space-y-6">
        <ComponentCardExtend title="Payment Table" features={features}>
          <TableGeneric
            records={payments}
            headers={headers}
            header_visible={header_visible}
            previous={isPrevious}
            next={isNext}
            quantity={quantity}
            ids={ids}
            perPage={perPage}
            changePage={onStatusChangePage}
            handleSearch={handleSearch}
            setPerPage={setPerPage}
            onStartDate={setStartDate}
            onEndDate={setEndDate}
          />
        </ComponentCardExtend>
      </div>
      {/* <Modal isOpen={isCreate} onClose={() => {}}></Modal> */}
      <Modal
        isOpen={isCreate}
        onClose={closeCreateModal}
        className="h-screen max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add CFS
            </h4>
          </div>
          <div>
            {/* <GenericForm
              fields={formField}
              onSubmit={handleFormSubmit}
              validationForm={handleValidation}
            /> */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Payment;
