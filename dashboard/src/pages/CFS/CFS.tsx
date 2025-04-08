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
  // State
  const [cfss, setCfss] = useState<Record[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isNext, setIsNext] = useState<string | null>(null);
  const [isPrevious, setIsPrevious] = useState<string | null>(null);
  const [statusChangePage, setStatusChangePage] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

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

  const getList = async (query: string = ""): Promise<void> => {
    showLoading();
    try {
      const url = query ? `/cfss/?${query}` : `/cfss/`;
      const response = await axiosInstance.get(url);
      if (response.data) {
        setCfss(response.data.results);
        setHeaders(header);
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

  useEffect(() => {}, []);
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
      <div className="space-y-6">
        <ComponentCard title="CFS Table">
          <TableGeneric
            records={cfss}
            headers={headers}
            previous={isPrevious}
            next={isNext}
            quantity={quantity}
            changePage={onstatusChangePage}
            handleSearch={handleSearch}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default CFS;
