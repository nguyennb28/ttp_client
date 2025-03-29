import React, { useEffect } from "react";
import { useLoading } from "../provider/LoadingProvider";
import Gif1 from "../assets/login/1.gif";
import Gif2 from "../assets/login/2.gif";
import Gif3 from "../assets/login/3.gif";
import Gif4 from "../assets/login/4.gif";
import Gif5 from "../assets/login/5.gif";
import LoginForm from "../elements/LoginPage/LoginForm";

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
        </div>
      </div>
    </>
  );
};

export default LoginPage;
