import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import TableGeneric from "../../components/tables/BasicTables/TableGeneric";
import PageMeta from "../../components/common/PageMeta";
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

  const getList = async () => {
    try {
      showLoading();
      const response = await axiosInstance.get("/cfss/");
      if (response.data) {
        console.table(response.data);
        setCfss(response.data.results);
        setHeaders(header);
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
      <PageMeta
        title="CFS Table"
        description="This is CFS Table for T.T.P Logistics"
      />
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
