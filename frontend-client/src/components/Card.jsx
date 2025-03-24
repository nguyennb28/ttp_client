import React from "react";
import DefaultImage from "../assets/default/default.png";

const Card = ({ img, title, description }) => {
  return (
    <>
      <div className="flex flex-col items-center hover:shadow-2xl border rounded-lg border-dashed p-5">
        {/* img */}
        <div className="mb-3">
          {img ? (
            <img src={img} alt="Image" className="w-27 h-21" />
          ) : (
            <img src={DefaultImage} className="w-27 h-21" />
          )}
        </div>
        {/* title */}
        <div className="mb-3">
          <h2 className="text-xl font-bold">{title ? title : "Default title"}</h2>
        </div>
        {/* description */}
        <div>
          <p className="">{description ? description : "Default description"}</p>
        </div>
      </div>
    </>
  );
};

export default Card;
