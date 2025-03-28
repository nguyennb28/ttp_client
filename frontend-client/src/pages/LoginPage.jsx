import React, { useEffect } from "react";
import { useLoading } from "../provider/LoadingProvider";

const LoginPage = () => {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    showLoading();

    const timerId = setTimeout(() => {
      hideLoading();
    }, 1000);

    return () => clearTimeout(timerId);
  }, [showLoading, hideLoading]);

  return <></>;
};

export default LoginPage;
