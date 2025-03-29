import React, { useEffect } from "react";
import { useLoading } from "../provider/LoadingProvider";
import Gif4 from "../assets/login/4.gif";
import LoginForm from "../elements/LoginPage/LoginForm";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    showLoading();

    const timerId = setTimeout(() => {
      hideLoading();
    }, 1000);

    return () => clearTimeout(timerId);
  }, [showLoading, hideLoading]);

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
          <LoginForm />
          <div className="px-10 flex items-center text-gray-500">
            <div className="border-t-2 w-full">
            </div>
            <Link to="/" className="px-3"><HomeIcon className="size-7"/></Link>
            <div className="border-t-2 w-full">
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
