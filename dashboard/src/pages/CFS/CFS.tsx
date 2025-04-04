import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import TableGeneric from "../../components/tables/BasicTables/TableGeneric";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../instance/axiosInstance";
import { useLoading } from "../../context/LoadingContext";

interface Record {
  [key: string]: any;
}

const CFS = () => {
  const [cfss, setCfss] = useState<Record[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const { loading, showLoading, hideLoading } = useLoading();

  const getList = async () => {
    try {
      showLoading();
      const response = await axiosInstance.get("/cfss/");
      if (response.data) {
        setCfss(response.data.results);
        setHeaders(Object.keys(response.data.results[0]));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {}, []);
  const { checkRole } = useAuth();
  useEffect(() => {
    checkRole();
    getList();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <PageBreadcrumb pageTitle="CFS" />
      <div className="space-y-6">
        <ComponentCard title="CFS Table">
          <TableGeneric records={cfss} headers={headers} />
        </ComponentCard>
      </div>
    </>
  );
};

export default CFS;
