import React, { useState, useEffect } from "react";
import CustomSwiper from "../components/Swiper";
const HomePage = () => {
  return (
    <div className="mx-auto flex flex-col max-w-7xl items-center justify-between p-6 lg:px-8">
      {/* First section */}
      <CustomSwiper />
      {/* Second section */}
      <div>
        <h1>Our Services</h1>
      </div>
    </div>
  );
};
export default HomePage;
