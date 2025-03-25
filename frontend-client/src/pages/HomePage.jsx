import React, { useState, useEffect } from "react";
import CustomSwiper from "../components/Swiper";
import SectionTwo from "../elements/HomePage/SectionTwo";
import SectionThree from "../elements/HomePage/SectionThree";

const HomePage = () => {
  return (
    <div className="mx-auto flex flex-col max-w-7xl items-center justify-between p-6 lg:px-8">
      {/* First section */}
      <CustomSwiper />
      {/* Second section */}
      <div className="mt-10 w-full text-center">
        <SectionTwo />
      </div>
      <div className="mt-10 w-full text-center">
        <SectionThree />
      </div>
    </div>
  );
};
export default HomePage;
