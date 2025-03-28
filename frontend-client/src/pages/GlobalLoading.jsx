import React from "react";
import { useLoading } from "../provider/LoadingProvider";
import LoadingPage from "../elements/LoadingPage/LoadingPage";

const GlobalLoading = () => {
  const { loading } = useLoading();
  return loading ? <LoadingPage /> : null;
};

export default GlobalLoading;
