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
      {/* <div className="mx-auto flex flex-col max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="grid lg:grid-cols-2">
          <div>
          <img src={ImageLogin} alt="" className="w-md h-md"/>
        </div>
      </div>
      </div> */}
      {/* <div className="grid lg:grid-cols-2 items-center justify-items-center w-screen h-screen"> */}
      <div className="grid lg:grid-cols-3 w-screen h-screen gap-3">
        <div className="col-span-2 p-10 bg-gray-800 flex items-center justify-center">
          <img src={Gif4} alt="" className="w-md h-md" loading="lazy"/>
          {/* <img src={FirstGif} alt="" className="w-md h-md" loading="lazy"/> */}
          {/* <img src={FirstGif} alt="" className="w-md h-md" loading="lazy"/> */}
        </div>
        <div className="self-center flex flex-col items-center">
          <div>
            {/* <h1 className="font-bold text-2xl">Đăng nhập</h1> */}
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
