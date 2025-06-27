import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../instance/axiosInstance";

const useProfile = () => {
  const [profile, setProfile] = useState({});
  const [loader, setLoader] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getProfile = useCallback(async () => {
    const access = localStorage.getItem("access");
    if (!access) {
      setLoader(false);
      alert("Chưa đăng nhập!!!");
      return;
    }
    try {
      setError(null);
      const { data: response } = await axiosInstance.get("/users/me/");
      setProfile(response);
    } catch (err: any) {
      console.error(err);
      setError(err);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  return { profile, loader, error };
};

export default useProfile;
