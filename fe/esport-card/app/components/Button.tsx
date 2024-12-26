import React from "react";
import { ButtonTypes } from "../types/ButtonTypes";

const Button = ({
  onClick,
  children,
  type = "button",
  className,
}: ButtonTypes) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`w-full bg-blue-500 text-white p-2 rounded shadow mt-4 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
