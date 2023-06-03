import { FC, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import Button from "@/pages/components/buttons/Button";
import { mutate } from "swr";

interface DeleteMingguProps {
  hari: string;
  sesi: string;
  ruang: string;
  jadwalId: string;
  idRuang: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteMinggu: FC<DeleteMingguProps> = ({
  hari,
  ruang,
  jadwalId,
  idRuang,
  sesi,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setIsLoading(true); // Set loading state to true
    setError(null); // Set error state to null
    try {
      const { data } = await axios.delete(`/api/jadwaldetail/${jadwalId}`);
      mutate("/api/jadwal");
      mutate(`/api/jadwal/hari?hari=${hari}&ruang_id=${idRuang}`, undefined);
      mutate(`/api/jadwal/hari?hari=${hari}&ruang_id=${idRuang}`);

      onSuccess();
      onClose();
    } catch (error: any) {

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
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(true); // Set loading state to true
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="text-Error-50 text-sm">{error}</p>}
      <p className="text-center">
        Apakah Anda yakin untuk menghapus jadwal pada hari{" "}
        <span className="font-semibold">{hari}</span>, dengan sesi{" "}
        <span className="font-semibold">{sesi}</span>, dan pada ruang{" "}
        <span className="font-semibold">{ruang}</span> secara permanen?
      </p>
      <div className="flex gap-4">
        <Button
          center
          bgColor="bg-Neutral-70"
          brColor=""
          label="Batal"
          textColor="text-Neutral-30"
          type="button"
          onClick={onClose}
          widthAuto
        />
        <button onClick={onSubmit} disabled={isLoading} className="w-full">
          <Button
            bgColor="bg-Error-50"
            center
            withBgColor
            brColor=""
            label={
              isLoading ? (
                <div className="flex gap-2 items-center">
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                  <span>Loading</span>
                </div>
              ) : (
                "Hapus"
              )
            }
            textColor="text-Neutral-100"
            type="button"
            widthAuto
          />
        </button>
      </div>
    </div>
  );
};

export default DeleteMinggu;
