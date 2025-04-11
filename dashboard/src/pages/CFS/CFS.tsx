import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardExtend from "../../components/common/ComponentCardExtend";
import TableGeneric from "../../components/tables/BasicTables/TableGeneric";
import PageMeta from "../../components/common/PageMeta";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../instance/axiosInstance";
import { useLoading } from "../../context/LoadingContext";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import GenericForm from "../Forms/GenericForm";
import { IFormField } from "../../interfaces/interfaces";

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
  // const [isAgency, setIsAgency] = useState<string | null>(null);
  // const [isPort, setIsPort] = useState<string | null>(null);
  // const [isCS, setIsCS] = useState<string | null>(null);
  // const [agency, setAgency] = useState<[]>([]);
  // const [port, setPort] = useState<[]>([]);
  // const [cs, setCS] = useState<[]>([]);
  const { isOpen, openModal, closeModal } = useModal();

  // Context
  const { loading, showLoading, hideLoading } = useLoading();
  const { checkRole } = useAuth();

  // Constant
  const NEXT = "next";
  const PREVIOUS = "previous";

  const header = [
    "id",
    "mbl",
    "container number",
    "agency",
    "container type",
    "size",
    "port",
    "eta",
  ];

  const handleFormSubmit = (formData: Record<string, any>) => {
    console.log("Form Data Submitted:", formData);
  };
  const getList = async (query: string = ""): Promise<void> => {
    showLoading();
    try {
      const url = query ? `/cfss/?${query}` : `/cfss/`;
      const response = await axiosInstance.get(url);
      if (response.data) {
        setCfss(response.data.results);
        setIsPrevious(response.data.previous);
        setIsNext(response.data.next);
        setQuantity(response.data.count);
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
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add CFS
            </h4>
          </div>
          <div>
            <GenericForm fields={formField} onSubmit={handleFormSubmit} />
          </div>
        </div>
        {/* Form at here */}
      </Modal>
      <div className="space-y-6">
        <ComponentCardExtend title="CFS Table" features={features}>
          <TableGeneric
            records={cfss}
            headers={header}
            previous={isPrevious}
            next={isNext}
            quantity={quantity}
            changePage={onstatusChangePage}
            handleSearch={handleSearch}
          />
        </ComponentCardExtend>
      </div>
    </>
  );
};

export default CFS;
