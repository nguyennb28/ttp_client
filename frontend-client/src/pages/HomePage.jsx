import React, { useState, useEffect } from "react";
import CustomSwiper from "../components/Swiper";
import SectionTwo from "../elements/HomePage/SectionTwo";

const HomePage = () => {
  return (
    <div className="mx-auto flex flex-col max-w-7xl items-center justify-between p-6 lg:px-8">
      {/* First section */}
      <CustomSwiper />
      {/* Second section */}
      <div className="mt-10 w-full text-center">
        <SectionTwo />
      </div>
    </div>
  );
};
export default HomePage;
