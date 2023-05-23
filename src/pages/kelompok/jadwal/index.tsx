import Search from "@/pages/components/Search";
import Button from "@/pages/components/buttons/Button";
import CardTambahJadwalKelompok from "@/pages/components/card/CardTambahJadwalKelompok";
import { ModalDetail } from "@/pages/components/modal/Modal";
import React, { FC, useEffect, useRef, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import * as yup from "yup";
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";
import { IoIosAdd } from "react-icons/io";


interface JadwalProps {
  kelompokId: string;
  onClose: () => void;
  onSuccess: () => void;
  data: any;
  onOpenModal?: () => void;
}

const schema = yup.object().shape({
  checkboxes: yup.mixed().nullable().transform((value, originalValue) => {
    if (originalValue === '') {
      return null; // Mengubah string kosong menjadi nilai null
    }
    return originalValue;
  }),
  checkboxes2: yup.mixed().nullable().transform((value, originalValue) => {
    if (originalValue === '' || !value) { // Check if value is falsy
      return []; // Return an empty array
    }
    return originalValue;
  }
  ),
});

type FormData = yup.InferType<typeof schema>

const Jadwal: FC<JadwalProps> = ({
  kelompokId,
  onClose,
  onSuccess,
  data,
}) => {

  const [onOpenModal, setOnOpenModal] = useState(false);

  const { data: jadwal, error } = useSWR<any[]>(`/api/kelompok/jadwal/${kelompokId}`, fetcher, {
    revalidateOnFocus: false // Menonaktifkan pengambilan data ulang saat komponen mendapatkan fokus
  });

  const { data: jadwalTanpaKelompok, error: errorJadwalTanpaKelompok } = useSWR<any[]>(`/api/kelompok/jadwal`, fetcher, {
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
  });

  watch('checkboxes');
  watch('checkboxes2');

  useEffect(() => {
    // Saat data di-load, centang semua checkbox
    setValue('checkboxes', jadwal?.map((item: any) => item.id));
  }, [jadwal, setValue]);

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

    try {
      await axios.put(`/api/kelompok/jadwal/${kelompokId}`, {
        data: data.checkboxes,
      });

      await axios.put(`/api/kelompok/jadwalnull/${kelompokId}`, {
        data: data.checkboxes2,
      });

      mutate(`/api/kelompok/jadwal/${kelompokId}`);
      mutate(`/api/kelompok/jadwalnull/${kelompokId}`);
      mutate(`/api/kelompok/${kelompokId}`);
      mutate(`/api/kelompok/jadwal`);


      setIsLoading(false); // Set loading state to false
      onSuccess(); // Trigger onSuccess function from parent component
      onClose(); // Trigger onClose function from parent component
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          {jadwal && jadwal.length > 0 ? (
            jadwal.map((item) => (
              // <CardTambahJadwalKelompok />
              <CardTambahJadwalKelompok
                key={item.id}
                type="checkbox"
                id={item.id}
                value={item.id}
                register={{ ...register('checkboxes') }}
                hari={item.hari}
                sesi={item.sesi.nama_sesi}
                ruang={item.ruang.nama_ruang}
                mata_pelajaran={item.mapel.nama_mapel}
                getValues={getValues} // Meneruskan fungsi getValues sebagai prop
                setValue={setValue} // Meneruskan fungsi setValue sebagai prop
                groupName="kelompok"
              />
            ))
          ) : (
            <div>Data tidak tersedia.</div>
          )}
        </div>
        <div className="w-full h-[1px] bg-Neutral-70"></div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="font-semibold text-lg text-Primary-20">
              Jadwal Tanpa Kelompok
            </p>
            <Search />
            <Button
              type="button"
              brColor="border-Tertiary-50"
              textColor="text-Tertiary-50"
              bgColor="bg-Tertiary-50"
              label="Tambah"
              icon={IoIosAdd}
              onClick={
                () => {
                  setOnOpenModal(true)
                }
              }
              outlined
            />
          </div>
          <div className=" h-72 overflow-auto scrollbar pr-2 ">
            <div className="grid grid-cols-3 gap-4 ">
              {jadwalTanpaKelompok && jadwalTanpaKelompok.length > 0 ? (
                jadwalTanpaKelompok.map((item) => (
                  <CardTambahJadwalKelompok
                    key={item.id}
                    type="checkbox"
                    id={item.id}
                    value={item.id}
                    register={{ ...register('checkboxes2') }}
                    hari={item.hari}
                    sesi={item.sesi.nama_sesi}
                    ruang={item.ruang.nama_ruang}
                    mata_pelajaran={item.mapel.nama_mapel}
                    getValues={getValues} // Meneruskan fungsi getValues sebagai prop
                    setValue={setValue} // Meneruskan fungsi setValue sebagai prop
                    groupName="jadwalTanpaKelompok"
                  />
                ))
              ) : (
                <div>Data tidak tersedia.</div>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-4">
            <Button
              center
              bgColor="bg-Neutral-70"
              brColor=""
              label="Batal"
              textColor="text-Neutral-30"
              type="button"
            // onClick={onClose}
            />
            <Button
              type="submit"
              bgColor="bg-Tertiary-50"
              brColor=""
              label="Konfirmasi"
              textColor="text-Neutral-100"
              withBgColor
            />
          </div>
        </div>
        {
          onOpenModal && (
            <ModalDetail
              titleModal="Tambah Jadwal"
              onClose={() => setOnOpenModal(false)}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <p className="font-semibold text-lg text-Primary-20">
                      Jadwal Tanpa Kelompok
                    </p>
                    <Button
                      type="button"
                      brColor="border-Tertiary-50"
                      textColor="text-Tertiary-50"
                      bgColor="bg-Tertiary-50"
                      label="Close Tambah"
                      onClick={
                        () => {
                          setOnOpenModal(false)
                        }
                      }
                    />
                  </div>
                </div>
              </div>
            </ModalDetail>
          )
        }
      </div>
    </form>
  );
};

export default Jadwal;
