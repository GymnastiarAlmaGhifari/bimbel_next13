import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "@/pages/components/buttons/Button";
import { mutate } from "swr";

interface DeleteRabuProps {
  hari: string;
  sesi: string;
  ruang: string;
  jadwalId: string;
  idRuang: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteRabu: FC<DeleteRabuProps> = ({
  hari,
  ruang,
  jadwalId,
  idRuang,
  sesi,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const { data } = await axios.delete(`/api/jadwaldetail/${jadwalId}`);
      mutate("/api/jadwal");
      mutate(`/api/jadwal/hari?hari=${hari}&ruang_id=${idRuang}`, undefined);
      mutate(`/api/jadwal/hari?hari=${hari}&ruang_id=${idRuang}`);

      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(true); // Set loading state to true
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center">
        Apakah Anda yakin untuk menghapus jadwal pada hari{" "}
        <span className="font-semibold">{hari}</span>, dengan sesi{" "}
        <span className="font-semibold">{sesi}</span>
        ,dan pada ruang <span className="font-semibold">{ruang}</span> secara
        permanen?
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
          {isLoading ? (
            "Deleting..."
          ) : (
            <Button
              bgColor="bg-Error-50"
              center
              withBgColor
              brColor=""
              label="Delete"
              textColor="text-Neutral-100"
              type="button"
              widthAuto
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteRabu;