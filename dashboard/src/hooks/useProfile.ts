import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../instance/axiosInstance";

const useProfile = () => {
  const [profile, setProfile] = useState({});

  const getProfile = useCallback(async () => {
    const access = localStorage.getItem("access");
    if (access) {
      const { data: response } = await axiosInstance.get("/users/me/");
      setProfile(response);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  return { ...profile };
};

export default useProfile;
