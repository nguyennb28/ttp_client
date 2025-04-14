import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { IFormField } from "../../interfaces/interfaces";
import axiosInstance from "../../instance/axiosInstance";

interface GenericFormProps {
  fields: IFormField[];
  onSubmit: (formData: Record<string, any>) => void;
  validationForm: (formData: Record<string, any>) => object;
}

const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  onSubmit,
  validationForm,
}) => {
  const initialValues = fields.reduce(
    (acc: { [key: string]: string | boolean }, field: IFormField) => {
      acc[field.name] = field.type === "checkbox" ? false : "";
      return acc;
    },
    {}
  );

  const inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-xs shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`;

  const [formData, setFormData] = useState(initialValues);
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>(
    {}
  );
  const [searchResults, setSearchResults] = useState<{ [key: string]: string }>(
    {}
  );
  const [errors, setErrors] = useState(null);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    const fieldName = event.target.name;
    const api = event.target.dataset.api;
    setSearchQueries((prev) => ({
      ...prev,
      [fieldName]: newQuery, // Lưu trữ giá trị tìm kiếm cho trường cụ thể
    }));
    if (!api || !newQuery) {
      return;
    }
    const endPoint = `${event.target.dataset.api}${newQuery}`;
    fetchSearchResults(fieldName, endPoint);
  };

  const fetchSearchResults = async (fieldName: string, endPoint: string) => {
    try {
      const response = await axiosInstance.get(`${endPoint}`);
      if (response.status == 200) {
        const { results } = response.data;
        setSearchResults((prev) => ({
          ...prev,
          [fieldName]: results,
        }));
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const renderFormField = (
    field: IFormField,
    formData: Record<string, any>,
    handleChange: (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void
  ) => {
    switch (field.type) {
      case "text":
        return (
          <>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className={inputClasses}
              placeholder={field.placeholder || ""}
            />
            {errors && (
              <p className="text-red-600 text-xs">{errors[field.name]}</p>
            )}
          </>
        );
      case "number":
        return (
          <>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              step="0.01"
              onChange={handleChange}
              className={inputClasses}
            />
            {errors && (
              <p className="text-red-600 text-xs">{errors[field.name]}</p>
            )}
          </>
        );
      case "select":
        if (field.apiSearch !== null) {
          return (
            <>
              <input
                type="text"
                id={`search-${field.name}`}
                name={field.name}
                onChange={handleSearchInputChange}
                placeholder={`Enter ${field.label}`}
                data-api={field.apiSearch}
                className={inputClasses}
              />
              <select
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                className={inputClasses}
                onChange={handleChange}
              >
                <option value="">--- Select an option ----</option>
                {searchResults[field.name]?.map(
                  (result: any, index: number) => (
                    <option key={result.id} value={result.id}>
                      {result.name}
                    </option>
                  )
                )}
              </select>
              {errors && (
                <p className="text-red-600 text-xs">{errors[field.name]}</p>
              )}
            </>
          );
        }
        return (
          <>
            <select
              name={field.name}
              id={field.name}
              value={formData[field.name] || ""}
              className={inputClasses}
              onChange={handleChange}
            >
              <option value="">---- Select an option ----</option>
              {field.options &&
                field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
            {errors && (
              <p className="text-red-600 text-xs">{errors[field.name]}</p>
            )}
          </>
        );
      case "checkbox":
        return (
          <>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              checked={formData[field.name] || false}
              onChange={handleChange}
              className={inputClasses}
            />
            {errors && (
              <p className="text-red-600 text-xs">{errors[field.name]}</p>
            )}
          </>
        );
      case "email":
        return (
          <>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className={inputClasses}
            />
            {errors && (
              <p className="text-red-600 text-xs">{errors[field.name]}</p>
            )}
          </>
        );
      case "password":
        return (
          <>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
            />
            {errors && (
              <p className="text-red-600 text-xs">{errors[field.name]}</p>
            )}
          </>
        );
      case "date":
        return (
          <>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className={inputClasses}
            />
            {errors && (
              <p className="text-red-600 text-xs">{errors[field.name]}</p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (event.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const isValid = validationForm(formData);
    if (Object.keys(isValid).length === 0) {
      onSubmit(formData);
      setErrors({});
    } else {
      setErrors(isValid);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div className="flex flex-col my-2" key={field.name}>
            <label htmlFor={field.name} className="mb-1">
              {field.label}
            </label>
            {renderFormField(field, formData, handleChange)}
          </div>
        ))}
        <button
          type="submit"
          className="block focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default GenericForm;
