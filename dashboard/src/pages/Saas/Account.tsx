import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardExtend from "../../components/common/ComponentCardExtend";
import PageMeta from "../../components/common/PageMeta";
import { useLoading } from "../../context/LoadingContext";
import SimpleTable from "../../components/tables/BasicTables/SimpleTable";
import { useModal } from "../../hooks/useModal";
import { useState, useEffect } from "react";
import axiosInstance from "../../instance/axiosInstance";
import { useAuth } from "../../context/AuthContext";

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
  const[changePage, setChangePage] = useState<string | null>(null);

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
    console.log(value);
    setChangePage(value);
  }

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
      <div className="space-y-6">
        <ComponentCardExtend title="Account Table" features={features}>
          {/* <TableGeneric records={[]} headers={header} /> */}
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
