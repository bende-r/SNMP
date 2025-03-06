import React from "react";

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input = ({
  placeholder,
  value,
  onChange,
  className,
}: InputProps) => {
  return (
    <input
      className={`border p-2 rounded-md w-full ${className}`}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
