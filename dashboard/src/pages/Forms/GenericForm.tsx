import React, { useState, ChangeEvent, FormEvent } from "react";
import { IFormField } from "../../interfaces/interfaces";

interface GenericFormProps {
  fields: IFormField[];
  onSubmit: (formData: Record<string, any>) => void;
}

const GenericForm: React.FC<GenericFormProps> = ({ fields, onSubmit }) => {
  const initialValues: Record<string, any> = fields.reduce((acc, field) => {
    acc[field.name] = field.type === "checkbox" ? false : ""; // Set default values
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialValues);

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

  const renderFormField = (
    field: IFormField,
    formData: Record<string, any>,
    handleChange: (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void
  ) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        );
      case "select":
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
          >
            <option value="">Select an option</option>
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
            type="checkbox"
            id={field.name}
            name={field.name}
            checked={formData[field.name] || false}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          {renderFormField(field, formData, handleChange)}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );

};

export default GenericForm;
