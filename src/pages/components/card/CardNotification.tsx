import is from "date-fns/esm/locale/is/index.js";
import React, { FC } from "react";
import { BiEnvelope, BiEnvelopeOpen } from "react-icons/bi";
import { MdDelete, MdPayment, MdVisibility } from "react-icons/md";
import Button from "../buttons/Button";
import { HiOutlineCheck } from "react-icons/hi";

interface CardNotificationProps {
  isRead?: boolean;
  nama_siswa?: string;
  status?: string;
  tanggal_bayar?: string;
  onClick?: () => void;
  onAccept?: () => void;
}

const CardNotification: FC<CardNotificationProps> = ({
  isRead,
  status,
  nama_siswa,
  tanggal_bayar,
  onClick,
  onAccept,
}) => {
  return (
    <button
      className={`flex w-full h-max gap-4 items-center group ${
        isRead
          ? "bg-Neutral-100 hover:bg-Neutral-95"
          : "bg-Primary-95 hover:bg-Primary-90"
      }  px-4 py-2`}
    >
      <div
        className={`flex items-center h-max  p-4 rounded-full justify-center ${
          isRead
            ? "bg-Neutral-95 text-Neutral-20"
            : "bg-Primary-80 text-Primary-20"
        } `}
      >
        <MdPayment size={30} />
      </div>
      <div className="w-full flex flex-col items-start">
        <span className="font-semibold">{nama_siswa}</span>
        <p className="">Melakukan Pembayaran SPP</p>
      </div>
      <div className="w-60 h-full flex flex-col  gap-2">
        <span className="text-sm text-Neutral-30">{tanggal_bayar}</span>
        <span className="text-sm text-Neutral-30 font-semibold">{status}</span>
        <div className="hidden group-hover:flex justify-center gap-2">
          <button onClick={onClick} className="hover:text-Tertiary-50">
            <MdVisibility size={24} />
          </button>
          <button onClick={onAccept} className="hover:text-Primary-40">
            <HiOutlineCheck size={24} />
          </button>
        </div>
      </div>
    </button>
  );
};

export default CardNotification;
