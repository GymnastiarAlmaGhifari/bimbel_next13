import Button from "@/pages/components/buttons/Button";
import axios from "axios";
import React, { FC, useState } from "react";
import { mutate } from "swr";

interface KelasEditProps {
  kelasId: string;
  data: any;
  onClose: () => void;
  onSucsess: () => void;
}

const DeleteKelas: FC<KelasEditProps> = ({
  kelasId,
  data,
  onClose,
  onSucsess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    const { nama_kelas } = data;

    setIsLoading(true); // Set loading state to true

    try {
      await axios.delete(`/api/kelas/${kelasId}`, {
        data: {
          nama_kelas,
        },
      });

      mutate("/api/kelas");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onClose(); // Set loading state to false
      onSucsess();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center">
        Apakah Anda yakin untuk menghapus kelas <span className="font-semibold
        ">{data?.nama_kelas}</span>  secara
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

export default DeleteKelas;
