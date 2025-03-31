import React, { useEffect } from "react";
import { useLoading } from "../provider/LoadingProvider";
import Gif4 from "../assets/login/4.gif";
import LoginForm from "../elements/LoginPage/LoginForm";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Link, replace } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { user, login, checkAuth, logout } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const onSubmit = async (username, password) => {
    try {
      showLoading();
      const response = await login(username, password);
      if (response) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      hideLoading();
    }
  };

  useEffect(() => {
    showLoading();

    const timerId = setTimeout(() => {
      hideLoading();
    }, 1000);

    return () => clearTimeout(timerId);
  }, [showLoading, hideLoading]);

  useEffect(() => {
    checkAuth();
    const access = localStorage.getItem("access");
    if (access) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-3 w-screen h-screen gap-3">
        <div className="col-span-2 p-10 bg-gray-800 hidden lg:flex items-center justify-center">
          <img src={Gif4} alt="" className="w-md h-md" loading="lazy" />
        </div>
        <div className="self-center">
          <div>
            <h1 className="font-bold text-2xl text-center">Login</h1>
          </div>
          <LoginForm onSubmit={onSubmit} />
          <div className="px-10 flex items-center text-gray-500">
            <div className="border-t-2 w-full"></div>
            <Link to="/" className="px-3">
              <HomeIcon className="size-7" />
            </Link>
            <div className="border-t-2 w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
