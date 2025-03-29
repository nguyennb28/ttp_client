import React, { useState } from "react";

const Input = ({ label = "Tiêu đề", id, type = "text", placeholder = "" }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  if (type === "password") {
    return (
      <>
        <div className="px-10 my-5">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
          </label>
          <input
            type={passwordVisible ? "text" : "password"}
            name={id}
            id={id}
            className="block w-full p-2.5 rounded-xl bg-gray-50 border focus:ring-primary-600 border-gray-300"
            placeholder={placeholder}
          />
          <div className="flex mt-5 items-center">
            <input
              type="checkbox"
              id="passwordVisible"
              onClick={() => togglePasswordVisibility()}
              className="flex text-gray-500 mr-2 cursor-pointer"
            />
            <label
              htmlFor="passwordVisible"
              className="block text-gray-500 cursor-pointer"
            >
              {passwordVisible ? "Hide password" : "Show password"}
            </label>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="px-10 my-5">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <input
          type={type}
          name={id}
          id={id}
          className="block w-full p-2.5 rounded-xl bg-gray-50 border focus:ring-primary-600 border-gray-300"
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default Input;
