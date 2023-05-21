import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import Button from "@/pages/components/buttons/Button";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface MapelEditProps {
  mapelId: string;
  data: any;
  onClose: () => void;
}

interface Kelas {
  id: string;
  nama_kelas: string;
}

const schema = yup.object().shape({
  nama_mapel: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama mapel minimal 3 karakter"),
  kelas_id: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const MapelEdit: FC<MapelEditProps> = ({ mapelId, onClose, data }) => {
  const { data: kelas, error } = useSWR<Kelas[]>("/api/kelas", fetcher);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_mapel, kelas_id } = data;

    setIsLoading(true); // Set loading state to true

    try {
      await axios.put(`/api/mapel/${mapelId}`, {
        nama_mapel,
        kelas_id,
      });

      mutate("/api/mapel");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onClose(); // Set loading state to false
    }
  };
  const [isListOpenKelas, setIsListOpenKelas] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenKelas(false);

      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenKelas, componentRef]);

  const toggleListKelas = () => {
    setIsListOpenKelas(!isListOpenKelas);
  };

  const selectKelas = (kelas_id: string) => {
    setValue("kelas_id", kelas_id);
    setIsListOpenKelas(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <>
        {isLoading && <div className="loader">Loading...</div>}

        {!isLoading && (
          <>
            <div className="form-group">
              <Input
                id="nama_mapel"
                label="Nama Mapel"
                register={{ ...register("nama_mapel") }}
                errors={errors}
                defaultValue={data?.nama_mapel ?? ""}
              />
              {errors.nama_mapel && (
                <p className="text-red-500">{errors.nama_mapel.message}</p>
              )}

              {/* select kelas */}
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-sm text-Primary-10">
                  kelas
                </label>

                <div className="relative flex flex-col gap-2">
                  <button
                    type="button"
                    className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenKelas
                      ? "border-[2px] border-Primary-50 bg-Primary-95"
                      : "bg-Neutral-95"
                      }`}
                    onClick={toggleListKelas}
                  >
                    {/* buat label */}
                    {watch("kelas_id") ? (
                      kelas?.find((kelasItem) => kelasItem.id === watch("kelas_id"))
                        ?.nama_kelas
                    ) : (
                      <span className="text-Neutral-300">Pilih Kelas</span>
                    )}
                    {isListOpenKelas ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                  {isListOpenKelas && (
                    <ul className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1" ref={componentRef}>
                      {error ? (
                        <li>Error fetching data</li>
                      ) : !kelas ? (
                        <li>Loading...</li>
                      ) : kelas.length === 0 ? (
                        <li>No classes available</li>
                      ) : (
                        kelas.map((kelasItem) => (
                          <li key={kelasItem.id}>
                            <button
                              type="button"
                              className={`w-full text-left px-2 py-1 rounded-full ${watch("kelas_id") === kelasItem.id
                                ? "text-Primary-90 bg-Primary-20"
                                : "text-Primary-20 hover:bg-Primary-95"
                                }`}
                              onClick={() => selectKelas(kelasItem.id)}
                            >
                              {kelasItem.nama_kelas}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
                {errors.kelas_id && (
                  <span className="text-red-500">{errors.kelas_id.message}</span>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <Button
                bgColor="bg-Error-50"
                brColor=""
                label="Hapus Pengguna"
                textColor="text-Neutral-100"
                type="button"
                withBgColor
              />
              <Button
                bgColor="bg-Tertiary-50"
                brColor=""
                label="Konfirmasi"
                textColor="text-Neutral-100"
                type="submit"
                withBgColor
              />
              {/* <button type="submit" className="btn btn-primary">
                Simpan
              </button> */}
            </div>
          </>
        )}
      </>
    </form>
  );
};

export default MapelEdit;
