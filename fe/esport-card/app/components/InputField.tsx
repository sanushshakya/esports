import React from "react";
import { InputFieldTypes } from "../types/InputFieldTypes";

const InputField = ({
  placeholder,
  type = "text",
  register,
  name,
  errors,
  disabled = false,
}: InputFieldTypes) => {
  return (
    <div>
      <input
        placeholder={placeholder}
        type={type}
        {...register(name, { required: `${name} is required` })}
        className="w-full p-2 mt-2 border rounded"
        disabled={disabled}
      />
      {errors && <span className="text-red-500 mt-1">{errors.message}</span>}
    </div>
  );
};

export default InputField;
