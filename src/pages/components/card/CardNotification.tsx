import is from "date-fns/esm/locale/is/index.js";
import React, { FC } from "react";
import { BiEnvelope, BiEnvelopeOpen } from "react-icons/bi";
import { MdDelete, MdPayment } from "react-icons/md";
import Button from "../buttons/Button";

interface CardNotificationProps {
  isRead?: boolean;
}

const CardNotification: FC<CardNotificationProps> = ({ isRead }) => {
  return (
    <button
      className={`flex w-full h-20 gap-4 items-center group ${
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
        <span className="font-semibold">Agimul Karim</span>
        <p className="">Melakukan Pembayaran SPP</p>
      </div>
      <div className="w-60 h-full flex flex-col items-end gap-2">
        <span className="text-sm text-Neutral-30">12 Desember 2023</span>
        <div className="hidden group-hover:flex justify-end gap-2">
          <button className="hover:text-Error-50">
            <MdDelete size={24} />
          </button>
          {isRead ? (
            <button className="hover:text-Primary-40">
              <BiEnvelopeOpen size={24} />
            </button>
          ) : (
            <button className="hover:text-Primary-40">
              <BiEnvelope size={24} />
            </button>
          )}
        </div>
      </div>
    </button>
  );
};

export default CardNotification;
