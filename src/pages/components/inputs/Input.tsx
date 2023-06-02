import React from "react";
import { FieldErrors } from "react-hook-form";
import { BiDollar, BiHide, BiShow } from "react-icons/bi";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: any;
  errors: FieldErrors;
  defaultValue?: string | number;
  inputMode?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  checked?: boolean;
  iconRight?: React.ReactNode;
  onIconRightClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
  defaultValue,
  onChange,
  value,
  checked,
  inputMode,
  className,
  iconRight,
  onIconRightClick,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {formatPrice && (
        <BiDollar
          size={24}
          className="text-neutral-700 absolute top-5 left-2"
        />
      )}
      {iconRight && type !== "password" && (
        <div
          className="text-neutral-700 absolute right-2 cursor-pointer"
          onClick={onIconRightClick}
        >
          {/* {iconRight} */}
        </div>
      )}
      <label className="text-sm text-Primary-10">{label}</label>
      <div className="relative">
        <input
          id={id}
          disabled={disabled}
          {...register}
          placeholder=" "
          type={type}
          onChange={onChange}
          value={value}
          checked={checked}
          inputMode={inputMode}
          defaultValue={defaultValue}
          className={
            `
            bg-Neutral-95
            peer
            h-10
            w-full
            px-4
            py-2
            rounded-full
            outline-none
            transition
            box-border
            disabled:opacity-70
            disabled:cursor-not-allowed
            focus:border-[2px] focus:border-Primary-50 focus:bg-Primary-99
            ${formatPrice ? "pl-9" : "pl-4"}
          ` + className
          }
        />
        {type === "password" && (
          <div
            className="text-neutral-700 absolute top-3 right-2 cursor-pointer"
            onClick={onIconRightClick}
          >
            {iconRight}
          </div>
        )}
        {type === "text" && (
          <div
            className="text-neutral-700 absolute top-3 right-2 cursor-pointer"
            onClick={onIconRightClick}
          >
            {iconRight}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
