import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className }: TableProps) => {
  return (
    <table
      className={`w-full border-collapse border border-gray-300 ${className}`}
    >
      {children}
    </table>
  );
};

export const TableHeader = ({ children }: TableProps) => {
  return <thead className="bg-gray-200">{children}</thead>;
};

export const TableRow = ({ children }: TableProps) => {
  return <tr className="border-b">{children}</tr>;
};

export const TableCell = ({ children }: TableProps) => {
  return <td className="p-2 border">{children}</td>;
};

export const TableBody = ({ children }: TableProps) => {
  return <tbody>{children}</tbody>;
};

export default Table;
