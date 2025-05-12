import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardExtend from "../../components/common/ComponentCardExtend";
import PageMeta from "../../components/common/PageMeta";
import { useLoading } from "../../context/LoadingContext";
import { useModal } from "../../hooks/useModal";
import { useState, useEffect } from "react";
import axiosInstance from "../../instance/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import SimpleTable from "../../components/tables/BasicTables/SimpleTable";
import { IFormField } from "../../interfaces/interfaces";
import GenericForm from "../Forms/GenericForm";

const DatabaseSaas = () => {
  // Context
  const { loading, showLoading, hideLoading } = useLoading();
  const { isOpen, openModal, closeModal } = useModal();
  const { checkAdmin, checkAuth } = useAuth();

  // State
  const [databases, setDatabases] = useState<Record<string, any>[]>([]);
  const [previous, setPrevious] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [changePage, setChangePage] = useState<string | null>(null);

  // Variable
  const headers = ["options", "id", "database name"];
  const fields = ["options", "id", "database_name"];
  const formField: IFormField[] = [
    {
      name: "db_name",
      label: "Database name",
      type: "text",
      required: true,
    },
  ];

  // Methods
  const cleanStates = () => {};

  const features = async (e: string) => {
    if (e == "refresh") {
      cleanStates();
      try {
        await getDatabases();
      } catch (err) {
        console.error(err);
      }
    }
    if (e == "create") {
      openModal();
    }
    if (e == "delete") {
      // make handle delete
    }
  };

  const getDatabases = async () => {
    showLoading();
    try {
      const response = await axiosInstance.get("/databases/");
      if (response.status == 200) {
        setDatabases(response.data.results);
      }
    } catch (err) {
      console.error(err);
      alert("Can't fetch database");
    } finally {
      hideLoading();
    }
  };

  const onChangePage = (value: string | null) => {
    setChangePage(value);
  };

  const handleValidation = (formData: Record<string, any>) => {
    const errors: Record<string, any> = {};
    if (!formData.db_name) {
      errors.db_name = "Database name is empty";
    }
    return errors;
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    const validate = handleValidation(formData);
    if (Object.keys(validate).length === 0) {
      try {
        showLoading();
        const response = await axiosInstance.post("/databases/", formData);
        if (response.status == 201) {
          closeModal();
          alert("Successfully");
          await getDatabases();
        }
      } catch (err) {
        console.error(err);
        alert("Create Failed");
      } finally {
        hideLoading();
      }
    }
  };

  useEffect(() => {
    const refreshToken = async () => {
      try {
        showLoading();
        await checkAuth();
      } catch (err) {
        console.error(err);
      } finally {
        hideLoading();
      }
    };
    const fetchData = async () => {
      await getDatabases();
    };
    refreshToken();
    checkAdmin();
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      {/* <div>Database-Saas</div> */}
      <PageMeta
        title="Database for client"
        description="This is a feature create datbase for logistics companies"
      />
      <PageBreadcrumb pageTitle="Database" />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="h-screen max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add database
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
      </Modal>
      <div className="space-y-6">
        <ComponentCardExtend title="Database table" features={features}>
          <SimpleTable
            records={databases}
            headers={headers}
            fields={fields}
            previous={previous}
            next={next}
            changePage={onChangePage}
          />
        </ComponentCardExtend>
      </div>
    </>
  );
};

export default DatabaseSaas;
