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
  const [isNext, setIsNext] = useState<string | null>(null);
  const [isPrevious, setIsPrevious] = useState<string | null>(null);
  const [statusChangePage, setStatusChangePage] = useState<string | null>(null);

  const { loading, showLoading, hideLoading } = useLoading();

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

  const getList = async () => {
    try {
      showLoading();
      const response = await axiosInstance.get("/cfss/");
      if (response.data) {
        setCfss(response.data.results);
        setHeaders(header);
        setIsPrevious(response.data.previous);
        setIsNext(response.data.next);
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

  const changePage = async (url: string) => {
    try {
      showLoading();
      const response = await axiosInstance.get(`/cfss/?${url}`);
      if (response.data) {
        setCfss(response.data.results);
        setHeaders(header);
        setIsPrevious(response.data.previous);
        setIsNext(response.data.next);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      hideLoading();
    }
  };

  const onChangePage = () => {
    if (statusChangePage) {
      let url = "";
      if (statusChangePage == NEXT) {
        if (isNext) {
          url = isNext.split("?")[1];
        }
      } else {
        if (isPrevious) {
          url = isPrevious.split("?")[1];
          if (url == undefined) {
            url = "";
          }
        }
      }
      console.log(url);
      setStatusChangePage(null);
      changePage(url);
    }
  };

  useEffect(() => {}, []);
  const { checkRole } = useAuth();
  useEffect(() => {
    checkRole();
    getList();
  }, []);

  useEffect(() => {
    onChangePage();
  }, [statusChangePage]);

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
          <TableGeneric
            records={cfss}
            headers={headers}
            previous={isPrevious}
            next={isNext}
            changePage={onstatusChangePage}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default CFS;
