import React, { FC, useEffect, useRef, useState } from "react";
import { IoIosClose, IoIosNotifications } from "react-icons/io";
import CardNotification from "./card/CardNotification";
import Button from "./buttons/Button";
import { MdDelete } from "react-icons/md";
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail, ModalSucces } from "./modal/Modal";
import Acc from "../pembayaran/modal/acc";
import LihatNota from "../pembayaran/modal/nota";

interface NotificationProps {
  id: string;
  nama_rekening?: string;
  nomor_rekening?: string;
  jumlah_tagihan?: number;
  tanggal_tagihan?: string;
  tanggal_jatuh_tempo?: string;
  tanggal_bayar?: string;
  tanggal_approve?: string;
  Bulan?: string;
  Tahun?: number;
  status?: string;
  nota?: string;
  user?: {
    name?: string;
  };
  siswa?: {
    nama?: string;
    image?: string;
  };
}

const Notification: FC<NotificationProps> = () => {
  const { data: notification, error } = useSWR("/api/notif", fetcher, {
    refreshInterval: 1000 * 60,
  });

  const [isOpen, setIsOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  const handleModalClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    // Check if the clicked element is a button or has a button ancestor
    const isButtonClicked = (event.target as HTMLElement).closest("button");

    // Close the modal only if the clicked element is not a button
    if (!isButtonClicked) {
      event.stopPropagation();
    }
  };
  const [showNota, setShowNota] = useState<NotificationProps | null>(null);

  const [AcceptPembayaran, setAcceptPembayaran] = useState<NotificationProps | null>(
    null
  );

  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccess(false);
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

  return (
    <div className="relative">
      <button
        className="h-12 w-12 relative flex items-center justify-center"
        onClick={handleClick}
      >
        <div className="text-Neutral-20">
          <IoIosNotifications size={40} />
        </div>
        {
          notification?.jumlah > 0 ? (
            <div className="h-6 w-6 bg-Error-50 rounded-full absolute flex items-center justify-center top-0 right-0 border-[2px] border-Neutral-100">
              <span className="text-xs font-semibold text-Neutral-100">{notification?.jumlah}</span>
            </div>
          ) : (
            ""
          )
        }
      </button>
      {isOpen ? (
        <div
          className="absolute right-0 mt-1 flex flex-col bg-Neutral-100 w-[550px] py-2 rounded-lg border-[1px] border-Neutral-90 gap-2"
          ref={componentRef}
          onClick={handleModalClick}
        >
          <div className="flex justify-between items-center">
            <h1 className="ml-4 font-bold text-Primary-10">
              Notifikasi ({notification?.jumlah})
            </h1>
            <Button
              type="button"
              bgColor="bg-Neutral-90"
              brColor=""
              label=""
              icon={IoIosClose}
              noLabel
              textColor="text-Neutral-30"
              onClick={handleClick}
            />
          </div>
          <div className="flex flex-col min-h-max max-h-96 overflow-y-auto scrollbar">
            {notification ? (
              <>
                {notification.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="font-bold text-Neutral-20">
                      Tidak Ada Notifikasi
                    </h1>
                  </div>
                ) : (
                  <>
                    {notification.data.map((notif: NotificationProps) => (
                      <CardNotification
                        key={notif.id}
                        nama_siswa={notif?.siswa?.nama}
                        tanggal_bayar={notif?.tanggal_bayar}
                        status={notif?.status}
                        onClick={
                          () => setShowNota(notif)
                        }
                        onAccept={() =>
                          setAcceptPembayaran(
                            notif
                          )
                        }
                      />
                    ))}
                  </>
                )}
              </>
            ) : (
              <>
                {error ? (
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-2xl font-bold text-Neutral-600">
                      Data Kosong
                    </p>
                    <p className="text-Neutral-500"></p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-2xl font-bold text-Neutral-600">
                      Loading...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          {showSuccess && (
            <ModalSucces label="" onClose={() => setShowSuccess(false)}>
            </ModalSucces>
          )}
          {showNota && (
            <ModalDetail silang
              titleModal={`Nota Tagihan ${showNota?.siswa?.nama}` + ` ${showNota?.Bulan}` + ` ${showNota?.Tahun}`}
              onClose={() => setShowNota(null)} wAuto
            >
              <LihatNota data={showNota} onClose={() => setShowNota(null)} />
            </ModalDetail>
          )}
          {AcceptPembayaran && (
            <ModalDetail wAuto
              titleModal="Konfirmasi Pembayaran"
              onClose={() => setAcceptPembayaran(null)}
            >
              <Acc
                idAcc={AcceptPembayaran.id}
                data={AcceptPembayaran}
                onClose={
                  () => setAcceptPembayaran(null)
                }
                onSuccess={
                  () => setShowSuccess(true)
                }
              />
            </ModalDetail>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Notification;
