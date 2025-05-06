import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardExtend from "../../components/common/ComponentCardExtend";
import PageMeta from "../../components/common/PageMeta";
import { useLoading } from "../../context/LoadingContext";
import SimpleTable from "../../components/tables/BasicTables/SimpleTable";
import { useModal } from "../../hooks/useModal";
import { useState, useEffect } from "react";
import axiosInstance from "../../instance/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { IFormField } from "../../interfaces/interfaces";
import { ROLES } from "../../variables/roles";
import { Modal } from "../../components/ui/modal";
import GenericForm from "../Forms/GenericForm";

const AccountSaas = () => {
  // Context
  const { loading, showLoading, hideLoading } = useLoading();
  const { isOpen, openModal, closeModal } = useModal();
  const { checkAdmin, checkAuth } = useAuth();

  //   Manage state
  const [users, setUsers] = useState<Record<string, any>[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [perPage, setPerPage] = useState<number>(10);
  const [changePage, setChangePage] = useState<string | null>(null);

  const NEXT = "next";
  const PREVIOUS = "previous";

  // Header for table
  const headers = [
    "options",
    "id",
    "username",
    "role",
    "phone",
    "tax code",
    "tenant db",
  ];

  // Fields to access object from API
  const fields = [
    "options",
    "id",
    "username",
    "role",
    "phone",
    "tax_code",
    "tenant_db",
  ];

  const formField: IFormField[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
    },
    {
      name: "full_name",
      label: "Fullname",
      type: "text",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: ROLES,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
    },
    {
      name: "tax_code",
      label: "Tax code",
      type: "text",
    },
  ];

  const features = async (e: string) => {
    if (e == "refresh") {
      try {
        showLoading();
        await getUsers();
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

  const cleanStates = () => {
    setPrevious(null);
    setNext(null);
    setCount(0);
    setUsers([]);
    setPerPage(10);
  };

  const getUsers = async () => {
    try {
      showLoading();
      const response = await axiosInstance.get("/users/");
      if (response.status == 200) {
        setPrevious(response.data.previous);
        setNext(response.data.next);
        setCount(response.data.count);
        setUsers(response.data.results);
      }
    } catch (err: any) {
      console.error(err);
      cleanStates();
    } finally {
      hideLoading();
    }
  };

  const onChangePage = (value: string | null) => {
    setChangePage(value);
  };

  const handleFormSubmit = () => {
    alert("Submit");
  };

  const handleValidation = (formData: Record<string, any>) => {
    const errors: Record<string, any> = {};
    return errors;
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
    const activeGetUsers = async () => {
      showLoading();
      try {
        await getUsers();
      } catch (err: any) {
        console.error(err);
      } finally {
        hideLoading();
      }
    };
    refreshToken();
    checkAdmin();
    activeGetUsers();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <PageMeta
        title="Account for client"
        description="This is Saas for logistics companies"
      />
      <PageBreadcrumb pageTitle="Account" />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="h-screen max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add account
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
        <ComponentCardExtend title="Account Table" features={features}>
          <SimpleTable
            records={users}
            headers={headers}
            fields={fields}
            previous={previous}
            next={next}
            quantity={count!}
            changePage={onChangePage}
          />
        </ComponentCardExtend>
      </div>
    </>
  );
};

export default AccountSaas;
