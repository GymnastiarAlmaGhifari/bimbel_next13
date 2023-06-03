import { FC, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import { IoIosArrowDown, IoIosArrowUp, IoMdCloudUpload } from "react-icons/io";

export const config = {
  api: {
    responseLimit: false,
  },
};

interface CreateModul {
  onClose: () => void;
  onSucsess: () => void;
}

interface Mapel {
  id: string;
  nama_mapel: string;
  kelas: {
    id: string;
    nama_kelas: string;
  };
}

const schema = yup.object().shape({
  nama_modul: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "judul minimal 3 karakter"),
  pdf: yup.mixed().required(),
  mapel: yup.string().required(),
});

type FormData = yup.InferType<typeof schema> & {
  pdf: FileList;
};

const Create: FC<CreateModul> = ({ onClose, onSucsess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListOpenMapel, setIsListOpenMapel] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

  const { data: mapel, error: errorMapel } = useSWR<Mapel[]>(
    "/api/mapel",
    fetcher
  );
  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenMapel(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenMapel, componentRef]);

  const toggleListMapel = () => {
    setIsListOpenMapel(!isListOpenMapel);
  };

  const selectMapel = (mapel: string) => {
    setValue("mapel", mapel);
    setIsListOpenMapel(false);
  };

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
    const { nama_modul, mapel, pdf } = data;

    setIsLoading(true); // Set loading state to true
    setError(null);

    try {
      const response = await axios.post(`/api/modul`, {
        nama_module: nama_modul,
        mapel_id: mapel,
      });
      mutate("/api/mdoul");
      // onClose(); // Set loading state to false

      // console.log(response.data);
      // simpan response data.id ke variable id
      const id = response.data.id;

      // console.log(id);
      // api yang  digunakan untuk upload file

      const formData = new FormData();
      formData.append("pdf", data.pdf[0]);

      const responseUpload = await axios.post(`/api/modul/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(responseUpload.data);

      const responsethumb = await axios.post(`/api/modul/thumbup`, {
        id: id,
      });

      // console.log(responsethumb.data);
      onClose(); // Set loading state to false
      onSucsess();
    } catch (error: any) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log("Response data:", axiosError.response.data);
          console.log("Response status:", axiosError.response.status);

          const responseData = axiosError.response.data as { message: string };

          // Extract the main error message from the response data
          const errorMessage = responseData.message;

          setError(`An error occurred: ${errorMessage}`);
        } else if (axiosError.request) {
          console.log("No response received:", axiosError.request);

          const request = axiosError.request.toString();
          setError(`No response received: ${request}`);
        } else {
          console.log("Error setting up the request:", axiosError.message);

          const request = axiosError.message.toString();
          setError(`Error setting up the request: ${request}`);
        }
      } else {
        console.log("Error:", error.message);
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
      onSucsess();
    }
  };

  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);

  // Fungsi event handler untuk memperbarui file PDF yang dipilih

  const handlePDFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedPDF(file || null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {error && <p className="text-red-500">{error}</p>}
      <Input
        id="nama_modul"
        label="Nama Modul"
        type="text"
        register={{ ...register("nama_modul") }}
        errors={errors}
      />
      {errors.nama_modul && (
        <p className="text-red-500">{errors.nama_modul.message}</p>
      )}

      {/* input type file pdf only */}
      <label
        htmlFor="pdf"
        className="bg-Primary-40 text-white px-4 py-2 rounded cursor-pointer flex items-center justify-center space-x-2 rounded-full bg-opacity-90 hover:bg-opacity-100"
      >
        <IoMdCloudUpload size={24} />
        <span className="font-semibold">Choose File</span>
      </label>
      <input
        type="file"
        id="pdf"
        {...register("pdf")}
        onChange={handlePDFChange}
        className="absolute w-0 h-0"
        accept="application/pdf"
      />
      {selectedPDF && <p className="text-green-500">{selectedPDF.name}</p>}
      {errors.pdf && <p className="text-red-500">{errors.pdf.message}</p>}

      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-sm text-Primary-10">
          Mapel
        </label>

        <div className="relative flex flex-col gap-2">
          <button
            type="button"
            className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
              isListOpenMapel
                ? "border-[2px] border-Primary-50 bg-Primary-95"
                : "bg-Neutral-95"
            }`}
            onClick={toggleListMapel}
          >
            {/* buat label */}
            {watch("mapel") ? (
              mapel?.find((mapel) => mapel.id === watch("mapel"))?.nama_mapel
            ) : (
              <span className="text-Neutral-300">Pilih Mapel</span>
            )}
            {isListOpenMapel ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {isListOpenMapel && (
            <ul
              className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
              ref={componentRef}
            >
              {error ? (
                <li>Error fetching data</li>
              ) : !mapel ? (
                <li>Loading...</li>
              ) : mapel.length === 0 ? (
                <li>No classes available</li>
              ) : (
                mapel.map((mapel) => (
                  <li key={mapel.id}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded-full ${
                        watch("mapel") === mapel.id
                          ? "text-Primary-90 bg-Primary-20"
                          : "text-Primary-20 hover:bg-Primary-95"
                      }`}
                      onClick={() => selectMapel(mapel.id)}
                    >
                      {mapel.nama_mapel}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        {errors.mapel && (
          <span className="text-red-500">{errors.mapel.message}</span>
        )}
      </div>
      <div className="flex flex-row justify-end gap-4">
        <Button
          center
          bgColor="bg-Neutral-70"
          brColor=""
          label="Batal"
          textColor="text-Neutral-30"
          type="button"
          onClick={onClose}
        />
        <Button
          type="submit"
          bgColor="bg-Tertiary-50"
          brColor=""
          label={
            isLoading ? (
              <div className="flex gap-2 items-center">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                <span>Loading</span>
              </div>
            ) : (
              "Konfirmasi"
            )
          }
          textColor="text-Neutral-100"
          withBgColor
        />
      </div>
    </form>
  );
};

export default Create;
