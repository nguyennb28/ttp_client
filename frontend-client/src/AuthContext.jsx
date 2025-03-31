import React, { useState, useEffect, useContext, createContext } from "react";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const login = async (username, password) => {
    try {
      const { data: tokenData } = await axiosInstance.post("/token/", {
        username,
        password,
      });
      const { access, refresh } = tokenData;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const { data: userData } = await axiosInstance.get("/users/me/");
      setUser(userData);
      return { access, refresh, user: userData };
    } catch (err) {
      throw new Error(err.reponse?.data?.detail || "Đăng nhập thất bại");
    }
  };
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const callRefreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    try {
      const { data: response } = await axiosInstance.post(`/token/refresh/`, {
        refresh,
      });
      const { access } = response;
      localStorage.setItem("access", access);
      window.location.reload();
    } catch (err) {
      console.err(
        `Không lấy được refresh token hoặc có thể không call được api ${err}`
      );
      throw err;
    }
  };

  const checkAuth = async () => {
    const access = localStorage.getItem("access");
    if (!access) {
      logout();
      return;
    }
    try {
      const decoded = jwtDecode(access);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;
      if (tokenExpiration < now) {
        await callRefreshToken();
      }
    } catch (err) {
      console.error(`Token không hợp lệ hoặc xảy ra lỗi khi decode: ${err}`);
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
        const access = localStorage.getItem("access");
        if (access) {
          const { data: response } = await axiosInstance.get("/users/me/");
          setUser(response);
        }
      } catch (err) {
        console.error(`Lỗi khi kiểm tra xác thực: ${err}`);
        logout();
      } finally {
        setUserLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = { user, login, logout, checkAuth, userLoading, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
