import { yupResolver } from "@hookform/resolvers/yup";
import React, { FC, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type TambahJadwalProps = {};

const TambahJadwal: FC<TambahJadwalProps> = ({}) => {
  const [isListOpenHari, setIsListOpenHari] = useState(false);
  const [isListOpenLevel, setIsListOpenLevel] = useState(false);
  const [isListOpenTipe, setIsListOpenTipe] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   setValue,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: yupResolver(schema),
  // });
  const hariOptions = [
    { value: "SENIN", label: "Senin" },
    { value: "SELASA", label: "Selasa" },
    { value: "RABU", label: "Rabu" },
    { value: "KAMIS", label: "Kamis" },
    { value: "JUMAT", label: "Jumat" },
    { value: "SABTU", label: "Sabtu" },
    { value: "MINGGU", label: "Minggu" },
  ];
  const tipeOptions = [
    { value: "PRIVATE", label: "PRIVATE" },
    { value: "SEMI_PRIVATE", label: "SEMI PRIVATE" },
    { value: "KELOMPOK", label: "KELOMPOK" },
  ];

  const levelOptions = [
    { value: "PREMIUM", label: "PREMIUM" },
    { value: "REGULER", label: "REGULER" },
  ];
  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenHari(false);
        setIsListOpenLevel(false);
        setIsListOpenTipe(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenHari, setIsListOpenLevel, setIsListOpenTipe, componentRef]);

  const toggleListKelas = () => {
    setIsListOpenHari(!isListOpenHari);
  };

  const toggleListLevel = () => {
    setIsListOpenLevel(!isListOpenLevel);
  };

  const toggleListTipe = () => {
    setIsListOpenTipe(!isListOpenTipe);
  };

  // const selectKelas = (hari: string) => {
  //   setValue("hari", hari);
  //   setIsListOpenHari(false);
  // };
  // const selectlevel = (level: string) => {
  //   setValue("level", level);
  //   setIsListOpenLevel(false);
  // };
  // const selectTipe = (tipe: string) => {
  //   setValue("tipe", tipe);
  //   setIsListOpenTipe(false);
  // };

  const getLevelLabel = (value: string) => {
    const option = levelOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const getTipeLabel = (value: string) => {
    const option = tipeOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  return <form></form>;
};

export default TambahJadwal;
