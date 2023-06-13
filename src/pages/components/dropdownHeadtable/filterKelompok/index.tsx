import React, { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { yupResolver } from "@hookform/resolvers/yup";

interface FilterKelompokProps {
  //   onClose: () => void;
}

const schema = yup.object().shape({
  tipe: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const FilterKelompok: FC<FilterKelompokProps> = ({}) => {
  const componentRef = useRef<HTMLUListElement>(null);
  const [isListOpenTipe, setIsListOpenTipe] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const tipeOptions = [
    { value: "PRIVATE", label: "PRIVATE" },
    { value: "SEMI_PRIVATE", label: "SEMI PRIVATE" },
    { value: "KELOMPOK", label: "KELOMPOK" },
  ];

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenTipe(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenTipe, componentRef]);

  const toggleListTipe = () => {
    setIsListOpenTipe(!isListOpenTipe);
  };

  const selectTipe = (tipe: string) => {
    setValue("tipe", tipe);
    setIsListOpenTipe(false);
  };

  const getTipeLabel = (value: string) => {
    const option = tipeOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  // buatkan useEffect untuk default value filterkelompok dengan nilai Kelompok
  useEffect(() => {
    setValue("tipe", "KELOMPOK");
  }, [setValue]);

  return (
    <div className="relative flex flex-col gap-2 w-40">
      <div className="relative flex flex-col gap-2">
        <button
          type="button"
          className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
            isListOpenTipe
              ? "border-[2px] border-Primary-50 bg-Primary-95"
              : "bg-Neutral-95"
          }`}
          onClick={toggleListTipe}
        >
          {getTipeLabel(watch("tipe") ?? "") || "...loading"}
          {isListOpenTipe ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
        {isListOpenTipe && (
          <ul
            className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
            ref={componentRef}
          >
            {tipeOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`w-full text-left px-2 py-1 rounded-full ${
                    watch("tipe") === option.value
                      ? "text-Primary-90 bg-Primary-20"
                      : "text-Primary-20 hover:bg-Primary-95"
                  }`}
                  onClick={() => selectTipe(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {errors.tipe && (
        <span className="text-red-500">{errors.tipe.message}</span>
      )}
    </div>
  );
};

export default FilterKelompok;
