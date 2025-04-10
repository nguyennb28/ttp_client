import React, { useState, ChangeEvent, FormEvent } from "react";
import { IFormField } from "../../interfaces/interfaces";

interface GenericFormProps {
  fields: IFormField[];
  onSubmit: (formData: Record<string, any>) => void;
}

const GenericForm: React.FC<GenericFormProps> = ({ fields, onSubmit }) => {
  const initialValues = fields.reduce(
    (acc: { [key: string]: string | boolean }, field: IFormField) => {
      acc[field.name] = field.type === "checkbox" ? false : "";
      return acc;
    },
    {}
  );

  const inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`;

  const [formData, setFormData] = useState(initialValues);

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
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className={inputClasses}
            placeholder={field.placeholder || ""}
          />
        );
      case "number":
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            step="0.01"
            onChange={handleChange}
            className={inputClasses}
          />
        );
      case "select":
        return (
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
        );
      case "checkbox":
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            checked={formData[field.name] || false}
            onChange={handleChange}
            className={inputClasses}
          />
        );
      case "email":
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className={inputClasses}
          />
        );
      case "password":
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        );
      case "date":
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className={inputClasses}
          />
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
    onSubmit(formData);
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
          className="block focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default GenericForm;
