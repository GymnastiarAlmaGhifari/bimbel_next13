"use client";
import Search from "@/pages/components/Search";
import Button from "@/pages/components/buttons/Button";
import CardTambahAnggotaKelompok from "@/pages/components/card/CardTambahAnggotakelompok";
import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";
import * as yup from "yup";
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";

interface AnggotaProps {
  kelompokId: string;
  onClose: () => void;
  onSuccess: () => void;
  data: any;
}

const schema = yup.object().shape({
  checkboxes: yup
    .mixed()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "") {
        return null; // Mengubah string kosong menjadi nilai null
      }
      return originalValue;
    }),
  checkboxes2: yup
    .mixed()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "" || !value) {
        // Check if value is falsy
        return []; // Return an empty array
      }
      return originalValue;
    }),
});

type FormData = yup.InferType<typeof schema>;

const Anggota: FC<AnggotaProps> = ({
  kelompokId,
  onClose,
  onSuccess,
  data,
}) => {
  const { data: anggota, error: errorKelompok } = useSWR<any[]>(
    `/api/kelompok/siswa/${kelompokId}`,
    fetcher,
    {
      revalidateOnFocus: false, // Menonaktifkan pengambilan data ulang saat komponen mendapatkan fokus
    }
  );

  const { data: siswaTanpaKelompok, error: errorSiswaTanpaKelompok } = useSWR<
    any[]
  >(`/api/kelompok/siswa`, fetcher, {
    revalidateOnFocus: false, // Menonaktifkan pengamb
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  watch("checkboxes");
  watch("checkboxes2");

  useEffect(() => {
    // Saat data di-load, centang semua checkbox
    setValue(
      "checkboxes",
      anggota?.map((item: any) => item.id)
    );
  }, [anggota, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    let { checkboxes } = data;
    let { checkboxes2 } = data;

    if (!Array.isArray(checkboxes)) {
      checkboxes = [checkboxes];
    }

    if (!Array.isArray(checkboxes2)) {
      checkboxes2 = [checkboxes2];
    }

    console.log(checkboxes2);

    console.log(checkboxes);

    setIsLoading(true); // Set loading state to true
    setError(null); // Reset error state

    try {
      await axios.put(`/api/kelompok/siswa/${kelompokId}`, {
        data: data.checkboxes,
      });

      await axios.put(`/api/kelompok/siswanull/${kelompokId}`, {
        data: data.checkboxes2,
      });

      mutate(`/api/kelompok/siswa/${kelompokId}`);
      mutate(`/api/kelompok/siswanull/${kelompokId}`);
      mutate(`/api/kelompok/${kelompokId}`);
      mutate(`/api/kelompok/siswa`);

      setIsLoading(false); // Set loading state to false
      onSuccess(); // Trigger onSuccess function from parent component
      onClose(); // Trigger onClose function from parent component
    } catch (error: any) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const responseData = axiosError.response.data as { message: string };

          // Extract the main error message from the response data
          const errorMessage = responseData.message;

          setError(`${errorMessage}`);
        } else if (axiosError.request) {

          const request = axiosError.request.toString();
          setError(`${request}`);
        } else {

          const request = axiosError.message.toString();
          setError(`${request}`);
        }
      } else {
        console.log("Error:", error.message);
        setError("An unknown error occurred.");
      }
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="text-Error-50 text-sm">{error}</p>}
      <div className="grid grid-cols-6">
        {anggota && anggota.length > 0 ? (
          anggota.map((item) => (
            <CardTambahAnggotaKelompok
              key={item.id}
              type="checkbox"
              id={item.id}
              value={item.id}
              register={{ ...register("checkboxes") }}
              label={item.nama}
              nomor_telepon={item.nomor_telepon}
              getValues={getValues} // Menebruskan fungsi getValues sebagai prop
              setValue={setValue} // Meneruskan fungsi setValue sebagai prop
              groupName="kelompok"
            />
          ))
        ) : (
          <div>Data tidak tersedia.</div>
        )}
      </div>
      <div className="w-full h-[1px] bg-Neutral-70 my-2"></div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between">
          <p className="font-semibold text-lg text-Primary-20">
            Siswa Tanpa Kelompok
          </p>
          <Search />
        </div>
        <div className=" h-80 overflow-auto scrollbar pr-2 ">
          <div className="grid grid-cols-6 gap-4 ">
            {siswaTanpaKelompok && siswaTanpaKelompok.length > 0 ? (
              siswaTanpaKelompok.map((item) => (
                <CardTambahAnggotaKelompok
                  key={item.id}
                  type="checkbox"
                  id={item.id}
                  value={item.id}
                  register={{ ...register("checkboxes2") }}
                  label={item.nama}
                  nomor_telepon={item.nomor_telepon}
                  getValues={getValues} // Meneruskan fungsi getValues sebagai prop
                  setValue={setValue} // Meneruskan fungsi setValue sebagai prop
                  groupName="siswaTanpaKelompok"
                />
              ))
            ) : (
              <div>Data tidak tersedia.</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-Primary-10 text-Primary-70 hover:bg-Primary-70 hover:text-white transition-all duration-200"
          onClick={onClose}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-Primary-70 text-white hover:bg-Primary-70 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex gap-1 items-center">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
              <span>Loading</span>
            </div>
          ) : (
            "Simpan"
          )}{" "}
        </button>
      </div>
    </form>
  );
};

// return (
//   <div className="flex flex-col gap-4">
//     <div className="grid grid-cols-6 gap-4">
//       {/* maping anggota dari fetch bentuk dalam checkbox */}
//       {anggota && anggota.map((item) => (
//         <div key={item.id}>
//           <input
//             type="checkbox"
//             id={item.id}
//             value={item.id}
//             {...register("checkboxes")} // Assuming you want to bind the checkbox values to the "checkboxes" property in the form data
//           />
//           <label htmlFor={item.id}>{item.name}</label>
//         </div>
//       ))}

//       {/* <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok /> */}
//     </div>
// <div className="w-full h-[1px] bg-Neutral-70"></div>
// <div className="flex flex-col gap-4">
//   <div className="flex justify-between">
//     <p className="font-semibold text-lg text-Primary-20">
//       Siswa Tanpa Kelompok
//     </p>
//     <Search />
//   </div>
//   <div className=" h-80 overflow-auto scrollbar pr-2 ">
//     <div className="grid grid-cols-6 gap-4 ">
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//       <CardTambahAnggotaKelompok />
//     </div>
//   </div>
//       <div className="flex justify-end mt-4 gap-4">
//         <Button
//           center
//           bgColor="bg-Neutral-70"
//           brColor=""
//           label="Batal"
//           textColor="text-Neutral-30"
//           type="button"
//         // onClick={onClose}
//         />
//         <Button
//           type="submit"
//           bgColor="bg-Tertiary-50"
//           brColor=""
//           label="Konfirmasi"
//           textColor="text-Neutral-100"
//           withBgColor
//         />
//       </div>
//     </div>
//   </div>
// );
// };

export default Anggota;
