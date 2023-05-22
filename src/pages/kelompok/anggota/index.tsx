import Search from "@/pages/components/Search";
import Button from "@/pages/components/buttons/Button";
import CardTambahAnggotaKelompok from "@/pages/components/card/CardTambahAnggotakelompok";
import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import * as yup from "yup";
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";

interface AnggotaProps {
  kelompokId: string;
  onClose: () => void;
  onSuccess: () => void;
  data: any;
};

const schema = yup.object().shape({
  checkboxes: yup.mixed().nullable().transform((value, originalValue) => {
    if (originalValue === '') {
      return null; // Mengubah string kosong menjadi nilai null
    }
    return originalValue;
  }),
});

type FormData = yup.InferType<typeof schema>



const Anggota: FC<AnggotaProps> = ({
  kelompokId,
  onClose,
  onSuccess,
  data,

}) => {



  // useEffect(() => {
  //   // Mengatur nilai default checkbox saat data anggota tersedia
  //   if (anggota) {
  //     const defaultCheckboxes = anggota.map((item: any) => item.id);
  //     setValue('checkboxes', defaultCheckboxes);
  //     checkboxesRef.current = defaultCheckboxes;
  //   }
  // }, [anggota, setValue]);

  // const onSubmit: SubmitHandler<FormData> = async (data) => {
  //   let { checkboxes } = data;

  //   if (!Array.isArray(checkboxes)) {
  //     checkboxes = [checkboxes];
  //   }

  //   console.log(checkboxes);

  //   // setIsLoading(true); // Set loading state to true

  //   // try {
  //   //   await axios.put(`/api/kelompok/${kelompokId}`, {
  //   //     Siswa: {
  //   //       connect: (checkboxes as string[]).map((item) => ({
  //   //         id: item,
  //   //       })),
  //   //     },
  //   //   });

  //   //   mutate(`/api/kelompok/siswa/${kelompokId}`);
  //   //   mutate(`/api/kelompok/${kelompokId}`);

  //   //   setIsLoading(false); // Set loading state to false
  //   //   onSuccess(); // Trigger onSuccess function from parent component
  //   //   onClose(); // Trigger onClose function from parent component
  //   // } catch (error) {
  //   //   console.log(error);
  //   //   setIsLoading(false); // Set loading state to false
  //   // }
  // };
  const { data: anggota, error } = useSWR<any[]>(`/api/kelompok/siswa/${kelompokId}`, fetcher, {
    revalidateOnFocus: false // Menonaktifkan pengambilan data ulang saat komponen mendapatkan fokus
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      checkboxes: [],
    },
  });

  // const checkboxesRef = useRef<string[]>([]);


  // const handleCheck = (value: string, checked: boolean) => {
  //   if (checked) {
  //     checkboxesRef.current.push(value);
  //   } else {
  //     const index = checkboxesRef.current.indexOf(value);
  //     if (index !== -1) {
  //       checkboxesRef.current.splice(index, 1);
  //     }
  //   }

  //   setValue(
  //     'checkboxes',
  //     checkboxesRef.current.length > 0 ? checkboxesRef.current : [],
  //     {
  //       shouldValidate: true,
  //     }
  //   );
  // };

  // useEffect(() => {
  //   if (anggota) {
  //     // Saat data di-load, centang semua checkbox
  //     setValue('checkboxes', anggota.map((item) => item.id));
  //   }
  // }, [anggota, setValue]);

  const watchCheckboxes :any = watch('checkboxes');


  useEffect(() => {
    // Saat data di-load, centang semua checkbox
    setValue('checkboxes', anggota?.map((item: any) => item.id));


  }, [anggota, setValue]);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    let { checkboxes } = data;

    if (!Array.isArray(checkboxes)) {
      checkboxes = [checkboxes];
    }

    console.log(checkboxes);

    setIsLoading(true); // Set loading state to true

    try {
      await axios.put(`/api/kelompok/siswa/${kelompokId}`, {
        data: data.checkboxes,
      });

      mutate(`/api/kelompok/siswa/${kelompokId}`);
      mutate(`/api/kelompok/${kelompokId}`);
      mutate(`/api/kelompok/siswa`);

      setIsLoading(false); // Set loading state to false
      onSuccess(); // Trigger onSuccess function from parent component
      onClose(); // Trigger onClose function from parent component
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Set loading state to false
    }
  };

  // buat useEffect untuk mengatur nilai default checkbox saat data anggota tersedia
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {anggota && anggota.length > 0 ? (
        anggota.map((item) => (
          <div key={item.id}>
            <input
              type="checkbox"
              id={`checkbox-${item.id}`}
              value={item.id}
              {...register('checkboxes')}
            />
            <label htmlFor={`checkbox-${item.id}`}>{item.nama}</label>
          </div>
        ))
      ) : (
        <div>Data tidak tersedia.</div>
      )}
      <button type="submit">Submit</button>
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
//     <div className="w-full h-[1px] bg-Neutral-70"></div>
//     <div className="flex flex-col gap-4">
//       <div className="flex justify-between">
//         <p className="font-semibold text-lg text-Primary-20">
//           Siswa Tanpa Kelompok
//         </p>
//         <Search />
//       </div>
//       <div className=" h-80 overflow-auto scrollbar pr-2 ">
//         <div className="grid grid-cols-6 gap-4 ">
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//           <CardTambahAnggotaKelompok />
//         </div>
//       </div>
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
