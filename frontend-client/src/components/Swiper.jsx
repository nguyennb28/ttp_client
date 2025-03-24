import React, { useRef, useState } from "react";
import Banner1 from "../assets/img_slide/18907.png";
import Banner2 from "../assets/img_slide/banner_img2_h2.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router";

// Import Swiper styles
import "swiper/css";

import "../swiper.css";

const CustomSwiper = () => {
  return (
    <>
      <Swiper className="mySwiper">
        <SwiperSlide>
          <div className="flex w-full justify-evenly items-center">
            <div className="text-start flex-1">
              <h1 className="text-6xl font-bold">
                UBESIZE YOUR <br /> LOGISTICS
              </h1>
              <p className="text-3xl font-light mt-3">
                Moving your products is our business
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  type="button"
                  className="bg-gray-300 shadow-xl px-10 py-3 rounded-full hover:bg-sky-400 hover:text-white"
                >
                  About us
                </Link>
              </div>
            </div>
            <div>
              <img src={Banner2} alt="Banner" />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex w-full justify-evenly items-center">
            <div className="text-start flex-1">
              <h1 className="text-6xl font-bold">
                YOUR STRATEGIC SOFTWARE DEVELOPMENT PROVIDER
              </h1>
              <p className="text-3xl font-light mt-3">
                Technologies we are passionate business
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  type="button"
                  className="bg-gray-300 shadow-xl px-10 py-3 rounded-full hover:bg-sky-400 hover:text-white"
                >
                  About us
                </Link>
              </div>
            </div>
            <div className="">
              <img src={Banner1} alt="Banner" />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default CustomSwiper;
