// LoadingContext.js
import React, { createContext, useState, useContext, useCallback } from "react";

const LoadingContext = createContext({
  loading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

// LoadingProvider sẽ chịu trách nhiệm quản lý state loading
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Các hàm tiện ích để bật/tắt trạng thái loading
  // const showLoading = () => setLoading(true);
  const showLoading = useCallback(() => {
    setLoading(true);
  }, []);
  const hideLoading = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <LoadingContext.Provider
      value={{ loading, showLoading, hideLoading, setLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

// Hook này giúp các component dễ dàng truy xuất context loading
export const useLoading = () => useContext(LoadingContext);
