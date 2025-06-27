import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../instance/axiosInstance";

interface VatInfo {
  company_name: string;
  address: string;
  company_tax_code: string;
  ward_or_commune: string;
  district: string;
  province_or_city: string;
  country: string;
  einvoice_contact_name: string;
  einvoice_contact_email: string;
}

const useVatInfo = (tax_code: string | undefined | null) => {
  const [vatInfo, setVatInfo] = useState<VatInfo | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const getVatInfo = useCallback(async () => {
    const access = localStorage.getItem("access");
    setLoader(true);
    setError(null);
    if (!access) {
      setLoader(false);
      alert("Chưa đăng nhập!!!");
      return;
    }
    try {
      const response = await axiosInstance.get(`/vat-infos/?q=${tax_code}`);
      setVatInfo(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err);
      setVatInfo(null);
    } finally {
      setLoader(false);
    }
    // if (access) {
    // const { data: response } = await axiosInstance.get(
    // `/vat-infos/?q=${tax_code}`
    // );
    // setVatInfo(response);
    // }
  }, []);

  useEffect(() => {
    if (!tax_code) {
      setVatInfo(null);
      return;
    }
    getVatInfo();
  }, [tax_code]);

  return { vatInfo, loader, error };
};

export default useVatInfo;
