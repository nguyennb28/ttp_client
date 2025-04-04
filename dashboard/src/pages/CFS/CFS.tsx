import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const CFS = () => {
  const { checkRole } = useAuth();
  useEffect(() => {
    checkRole();
  }, []);
  return <></>;
};

export default CFS;
