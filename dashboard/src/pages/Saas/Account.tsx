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
  const [ids, setIds] = useState<string[]>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [formValuesUpdate, setFormValuesUpdate] = useState<IFormField[]>([]);
  const [idUserUpdate, setIdUserUpdate] = useState<string | number | null>(
    null
  );

  // CONSTANT
  const NEXT = "next";
  const PREVIOUS = "previous";

  // Header for table
  const headers = [
    "options",
    "id",
    "username",
    "full name",
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
    "full_name",
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
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
    },
    {
      name: "first_name",
      label: "First name",
      type: "text",
      required: true,
    },
    {
      name: "last_name",
      label: "Last name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: ROLES,
      required: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      required: true,
    },
    {
      name: "tax_code",
      label: "Tax code",
      type: "text",
      required: true,
    },
    {
      name: "tenant_db",
      label: "Tenant database",
      type: "select",
      apiSearch: "/users/get_tenant_db/?q=",
      required: true,
    },
  ];

  const formFieldUser: IFormField[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
    },
    {
      name: "first_name",
      label: "First name",
      type: "text",
      required: true,
    },
    {
      name: "last_name",
      label: "Last name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: ROLES,
      required: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      required: true,
    },
    {
      name: "tax_code",
      label: "Tax code",
      type: "text",
      required: true,
    },
    {
      name: "tenant_db",
      label: "Tenant database",
      type: "select",
      apiSearch: "/users/get_tenant_db/?q=",
      required: true,
    },
  ];

  const features = async (e: string) => {
    if (e == "refresh") {
      cleanStates();
      try {
        showLoading();
        await getUsers();
      } catch (err: any) {
        console.error(err);
        // cleanStates();
      } finally {
        hideLoading();
      }
    }
    if (e == "create") {
      openModal();
    }
    if (e == "delete") {
      handleDelete();
    }
  };

  const cleanStates = () => {
    setPrevious(null);
    setNext(null);
    setCount(0);
    setUsers([]);
    setPerPage(10);
    setChangePage(null);
    setIds([]);
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
      // cleanStates();
    } finally {
      hideLoading();
    }
  };

  const onChangePage = (value: string | null) => {
    setChangePage(value);
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    const validate = handleValidation(formData);
    if (Object.keys(validate).length === 0) {
      try {
        showLoading();
        const response = await axiosInstance.post(`/users/`, formData);
        if (response.status == 201) {
          alert("Successfully");
          await getUsers();
          closeModal();
        }
      } catch (err: any) {
        console.log(err);
      } finally {
        hideLoading();
      }
    }
  };

  const handleValidation = (formData: Record<string, any>) => {
    const errors: Record<string, any> = {};
    // username
    if (!formData.username) {
      errors.username = "Username is empty!";
    }
    // password
    if (!isUpdate) {
      if (!formData.password) {
        errors.password = "Password is empty!";
      } else {
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          errors.password = passwordError;
        }
      }
    } else if (formData.password) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        errors.password = passwordError;
      }
    }
    // first_name
    if (!formData.first_name) {
      errors.first_name = "Firstname is empty!";
    }
    // last_name
    if (!formData.last_name) {
      errors.last_name = "Lastname is empty!";
    }
    // role
    if (!formData.role) {
      errors.role = "Select a role!";
    }
    // phone
    if (!formData.phone) {
      errors.phone = "Phone number is empty!";
    }
    // tax_code
    if (!formData.tax_code) {
      errors.tax_code = "Tax code is empty!";
    }
    // tenant_db
    if (!formData.tenant_db) {
      errors.tenant_db = "Select a tenant database!";
    }
    return errors;
  };

  const validatePassword = (password: string) => {
    let msg = "";
    if (password.length < 8) {
      msg += `\nPassword must be at least 8 characters.`;
    }
    if (/^\d+$/.test(password)) {
      msg += `\nPassword cannot be entirely numeric.\n`;
    }
    return msg.length > 0 ? msg : null;
  };

  const handleCheckbox = (value: string[]) => {
    const list = [...new Set(value)];
    setIds(list);
  };

  const handleDelete = async () => {
    if (ids.length > 0) {
      // Proccessing delete ids
      try {
        const response = await axiosInstance.post("/users/bulk_delete/", {
          ids: ids,
        });
        if (response.status == 200) {
          alert(`Succes`);
          cleanStates();
          await getUsers();
        }
      } catch (err: any) {
        alert("Delete failed");
      }
    } else {
      alert("Please select the specified id to delete.");
    }
  };

  const onUpdate = (value: boolean, id: string) => {
    setIsUpdate(value);
    setIdUserUpdate(id);
    const result = users.find((obj) => obj.id === id);

    const newFormUpdates: IFormField[] = formFieldUser.map((field) => ({
      ...field,
      value: result ? result[field.name] : "",
    }));
    setFormValuesUpdate(newFormUpdates);
  };

  const handleFormUpdateSubmit = async (formData: Record<string, any>) => {
    if (isUpdate) {
      const validate = handleValidation(formData);
      if (Object.keys(validate).length === 0) {
        try {
          const payload = { ...formData };
          if (!(payload.password.length > 0)) {
            delete payload.password;
          }
          const response = await axiosInstance.patch(
            `/users/${idUserUpdate!}/`,
            payload
          );
          if (response.status == 200) {
            alert("Updated successfully");
            setIsUpdate(false); // isUpdate = false -> close modal
            await getUsers();
          }
          // closeModal();
        } catch (err: any) {
          alert("Update failed");
          console.error(err);
        }
      }
    } else {
      alert("Can't update due to error!!!");
      return;
    }
  };

  useEffect(() => {
    const refreshToken = async () => {
      try {
        await checkAuth();
      } catch (err) {
        console.error(err);
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
            ids={ids}
            changePage={onChangePage}
            handleCheckbox={handleCheckbox}
            handleUpdate={onUpdate}
          />
        </ComponentCardExtend>
      </div>
      <Modal
        className="h-screen max-w-[700px] m-4"
        isOpen={isUpdate}
        onClose={() => {
          closeModal();
          setIsUpdate(false);
        }}
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Update account
            </h4>
          </div>
          <div>
            <GenericForm
              // fields={formField}
              fields={formValuesUpdate}
              onSubmit={handleFormUpdateSubmit}
              validationForm={handleValidation}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AccountSaas;
