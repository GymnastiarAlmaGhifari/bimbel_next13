"use client";

import {
    FieldErrors,
} from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register: any;
    errors: FieldErrors
    defaultValue?: string | number;
    inputMode?: string;
    className?: string;
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
    inputMode,
    className,
}) => {
    return (
        <div className="w-full flex flex-col gap-2">
            {formatPrice && (
                <BiDollar
                    size={24}
                    className="
              text-neutral-700
              absolute
              top-5
              left-2
            "
                />
            )}
            <label className="text-sm text-Primary-10">{label}</label>
            <input
                id={id}
                disabled={disabled}
                {...register}
                placeholder=" "
                type={type}
                inputMode={inputMode}
                defaultValue={defaultValue}
                className={`
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
            ${formatPrice ? 'pl-9' : 'pl-4'}

          ` + className}
            />
            {/* <label
                className={`
            absolute 
            text-md
            duration-150 
            transform 
            -translate-y-3 
            top-5 
            z-10 
            origin-[0] 
            ${formatPrice ? 'left-9' : 'left-4'}
            peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 
            peer-focus:scale-75
            peer-focus:-translate-y-4

          `}
            >
                {label}
            </label> */}
        </div>
    );
}

export default Input;