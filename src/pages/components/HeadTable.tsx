"use client";
import { MdOutlineSort, MdModeEdit } from "react-icons/md";
import Search from "./Search";
import Button from "./buttons/Button";
import { IoIosAdd } from "react-icons/io";
import { FC } from "react";

interface HeadTableProps {
  role?: boolean;
  onClick?: () => void;
  label: string;
  onChange?: (value: string) => void;
}

const HeadTable: React.FC<HeadTableProps> = ({
  role,
  onClick,
  label,
  onChange,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="bg-Neutral-100 flex flex-row items-center h-[72px] px-5">
      <div className="flex flex-row items-center gap-14 w-full">
        <h2 className="text-xl font-semibold text-Primary-10">{label}</h2>
        <div className="flex flex-row items-center gap-4">
          <Search onChange={handleInputChange} />

          <button className="flex gap-1">
            <MdOutlineSort size={24} />
            <span className="text-sm font-bold text-Neutral-20">Filter</span>
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          type="button"
          brColor="border-Tertiary-50"
          textColor="text-Tertiary-50"
          bgColor="bg-Tertiary-50"
          label="Tambah"
          icon={IoIosAdd}
          onClick={onClick}
          outlined
        />
        {role ? (
          <Button
            type="button"
            brColor="border-Primary-40"
            textColor="text-Primary-40"
            bgColor="bg-Primary-40"
            label="Role"
            outlined
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default HeadTable;
