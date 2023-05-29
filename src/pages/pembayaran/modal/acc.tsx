import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/pages/components/buttons/Button";

interface Acc {
  idAcc: string;
  data: any;
  onClose: () => void;
  // onSuccess: () => void;
}

const Acc: FC<Acc> = ({ idAcc, data, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <p className="text-Neutral-500">
          Apakah anda yakin ingin mengkonfirmasi pembayaran ini?
        </p>
        <div className="flex flex-row justify-between gap-2">
          <Button
            widthAuto
            center
            bgColor="bg-Neutral-70"
            brColor=""
            label="Batal"
            textColor="text-Neutral-30"
            type="button"
            onClick={onClose}
          />
          <Button
            widthAuto
            center
            type="submit"
            bgColor="bg-Tertiary-50"
            brColor=""
            // label ketika loading true maka labelnya jadi loading
            // label={isLoading ? "Loading..." : "Simpan"}
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
            // disabled={isLoading} // Disable the button when loading is true
          />
        </div>
      </div>
    </div>
  );
};

export default Acc;
