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
import DetailCFS from "./DetailCFS";
import UpdateCFS from "./UpdateCFS";

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
  const { isOpen, openModal, closeModal } = useModal();

  // Context
  const { loading, showLoading, hideLoading } = useLoading();
  const { checkRole } = useAuth();

  // Constant
  const NEXT = "next";
  const PREVIOUS = "previous";

  const header = [
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
            changePage={onstatusChangePage}
            handleSearch={handleSearch}
            recordDetail={detailCFS}
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
      {triggerUpdate && <UpdateCFS cfs={cfs!} setTrigger={setTriggerUpdate} />}
    </>
  );
};

export default CFS;
