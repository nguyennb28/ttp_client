import React from "react";
import DefaultImage from "../assets/default/default.png";

const Card = ({ id, img, title, description }) => {
  const classForParent = () => {
    if (id == 1) {
      return "flex flex-col items-center hover:shadow-2xl border border border-dashed p-5 rounded-tl-lg";
    } else if (id == 4) {
      return "flex flex-col items-center hover:shadow-2xl border border border-dashed p-5 rounded-tr-lg";
    } else if (id == 5) {
      return "flex flex-col items-center hover:shadow-2xl border border border-dashed p-5 rounded-bl-lg";
    } else if (id == 8) {
      return "flex flex-col items-center hover:shadow-2xl border border border-dashed p-5 rounded-br-lg";
    }
    return "flex flex-col items-center hover:shadow-2xl border border-dashed p-5";
  };

  return (
    <>
      <div className={classForParent()}>
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
          <h2 className="text-xl font-bold">
            {title ? title : "Default title"}
          </h2>
        </div>
        {/* description */}
        <div>
          <p className="">
            {description ? description : "Default description"}
          </p>
        </div>
      </div>
    </>
  );
};

export default Card;
