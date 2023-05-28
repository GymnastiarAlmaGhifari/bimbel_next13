import React, { FC, useEffect, useRef, useState } from "react";
import { IoIosClose, IoIosNotifications } from "react-icons/io";
import CardNotification from "./card/CardNotification";
import Button from "./buttons/Button";
import { MdDelete } from "react-icons/md";
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";

interface NotificationProps {
  onClose: () => void;
  id?: string;
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

const Notification: FC<NotificationProps> = ({ onClose }) => {
  const { data: notification, error } = useSWR("/api/notif", fetcher, {
    refreshInterval: 1000 * 60,
  });

  const [isOpen, setIsOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsOpen, componentRef]);

  const handleClick = () => {
    setIsOpen(!isOpen);
    console.log(open);
  };
  return (
    <div className="relative">
      <button
        className="h-12 w-12 relative flex items-center justify-center"
        onClick={handleClick}
      >
        <div className="text-Neutral-20">
          <IoIosNotifications size={40} />
        </div>
        <div className="h-6 w-6 bg-Error-50 rounded-full absolute flex items-center justify-center top-0 right-0 border-[2px] border-Neutral-100">
          <span className="text-xs font-semibold text-Neutral-100">10</span>
        </div>
      </button>
      {isOpen ? (
        <div
          className="absolute right-0 mt-1 flex flex-col bg-Neutral-100 w-[550px] py-2 rounded-lg border-[1px] border-Neutral-90 gap-2"
          ref={componentRef}
        >
          <div className="flex justify-between items-center">
            <h1 className="ml-4 font-bold text-Primary-10">
              Notifiaction (10)x
            </h1>
            <Button
              type="button"
              bgColor="bg-Neutral-90"
              brColor=""
              label=""
              icon={IoIosClose}
              noLabel
              textColor="text-Neutral-30"
              onClick={onClose}
            />
          </div>
          <div className="flex flex-col h-96 overflow-y-auto scrollbar">
            {notification ? (
              <>
                {notification.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-bold text-Neutral-20">
                      Tidak Ada Notifikasi
                    </h1>
                  </div>
                ) : (
                  <>
                    {notification.map((notif: NotificationProps) => (
                      <CardNotification
                        key={notif.id}
                        // bulan={notif.Bulan}
                        // jumlah_tagihan={notif?.jumlah_tagihan}
                        // nama_rekening={notif?.nama_rekening}
                        nama_siswa={notif?.siswa?.nama}
                        // nama_user={notif?.user?.name}
                        // nomor_rekening={notif?.nomor_rekening}
                        // nota={notif?.nota}
                        // status={notif?.status}
                        // tanggal_approve={notif?.tanggal_approve}
                        tanggal_bayar={notif?.tanggal_bayar}
                        status={notif?.status}
                        // tanggal_jatuh_tempo={notif?.tanggal_jatuh_tempo}
                        // tanggal_tagihan={notif?.tanggal_tagihan}
                        // gambar={notif?.siswa.image}
                        // tahun={notif?.Tahun}
                        // onClick={() =>
                        //   setShowNota(notif)
                        // }
                        // onAccept={() =>
                        //   setAcceptnotif(notif)
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
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Notification;
