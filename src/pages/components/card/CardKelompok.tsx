import { FC, useCallback, useEffect, useState } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";

interface CardKelompokProps {
  id?: string;
  jadwal_id: string;
  level: string;
  tipe: string;
  nama_kelompok: string;
  onClick: () => void;
}

interface Jadwal {
  id: string;
  hari: string;
  jadwal_id: string;
  sesi_id: string;
  mapel_id: string;
  user_id: string;
  ruang_id: string;
  createdAt: string;
  updatedAt: string;
  sesi: {
    id: string;
    nama_sesi: string;
    jam_mulai: string;
    jam_selesai: string;
    createdAt: string;
    updatedAt: string;
  };
  mapel: {
    id: string;
    nama_mapel: string;
    kelas_id: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    nomor_telepon: string;
    alamat: string;
    universitas: string | null;
    mapel_id: string | null;
    image: string;
    random: string | null;
    createdAt: string;
    updatedAt: string;
  };
  ruang: {
    id: string;
    nama_ruang: string;
    tipe: string;
    createdAt: string;
    updatedAt: string;
  };
}

const CardKelompok: FC<CardKelompokProps> = ({
  id,
  jadwal_id,
  nama_kelompok,
  tipe,
  level,
  onClick,
}) => {
  const [isExpandedDetails, setIsExpandedDetails] = useState(false);
  const [isExpandedJadwal, setIsExpandedJadwal] = useState(false);
  const [idKelompok, setIdKelompok] = useState("");
  const [idJadwal, setIdJadwal] = useState("");
  const [siswa, setSiswa] = useState([]);
  const [jadwal, setJadwal] = useState([]);

  const handleDetailsClick = () => {
    setIsExpandedDetails(!isExpandedDetails);
  };

  const handleJadwalClick = () => {
    setIsExpandedJadwal(!isExpandedJadwal);
  };

  const handleShowDetails = () => {
    setIdKelompok(id || "");
    handleDetailsClick();
  };

  const handleLihatJadwal = () => {
    setIdJadwal(jadwal_id);
    handleJadwalClick();
  };

  const fetchSiswaData = useCallback(async () => {
    try {
      const response = await fetch(`/api/kelompok/siswa/${idKelompok}`);
      const data = await response.json();
      setSiswa(data);
    } catch (error) {
      console.error("Error fetching siswa data:", error);
    }
  }, [idKelompok]);

  const fetchJadwalData = useCallback(async () => {
    try {
      const response = await fetch(`/api/kelompok/jadwal/${idJadwal}`);
      const data = await response.json();
      setJadwal(data);
    } catch (error) {
      console.error("Error fetching jadwal data:", error);
    }
  }, [idJadwal]);

  useEffect(() => {
    if (isExpandedDetails) {
      fetchSiswaData();
    }

    if (isExpandedJadwal) {
      fetchJadwalData();
    }
  }, [isExpandedDetails, isExpandedJadwal, fetchSiswaData, fetchJadwalData]);

  return (
    <div className={`flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3 ${isExpandedDetails || isExpandedJadwal ? 'h-[250px]' : 'h-[150px]'}`}>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl text-Neutral-10 font-bold">{nama_kelompok}</h1>
          <span className="text-Neutral-30">{tipe}</span>
        </div>
        <h3 className="text-sm text-Neutral-30 font-bold">{level}</h3>
      </div>
      <div className="w-full h-[1px] bg-Neutral-20"></div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            bgColor="bg-Primary-50"
            brColor=""
            label={isExpandedDetails ? "Hide Details" : "Show Details"}
            textColor="text-Primary-20"
            type="button"
            onClick={handleShowDetails}
            icon={isExpandedDetails ? IoIosArrowBack : IoIosArrowForward}
          />
          <Button
            bgColor="bg-Primary-50"
            brColor=""
            label="Lihat Jadwal"
            textColor="text-Primary-20"
            type="button"
            icon={isExpandedJadwal ? IoIosArrowBack : IoIosArrowForward}
            onClick={handleLihatJadwal}
          />
        </div>
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Kelompok"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onClick}
        />
      </div>
      <div className="flex">
        {isExpandedDetails && (
          <div className="mt-4">
            {siswa && (
              siswa.map((student: any, index: number) => (
                <div key={student.id} className="flex items-center mb-2">
                  <p className="mr-2 text-sm text-Neutral-50">{index + 1}.</p>
                  <div>
                    <p className="font-bold">{student.nama}</p>
                    <p className="text-sm text-Neutral-70">{student.nomor_telepon}</p>
                    {/* Render other student information */}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {isExpandedJadwal && (
          <div className="mt-4">
            {jadwal && (
              <div>
                <p>Daftar Jadwal:</p>
                {jadwal.map((item: any) => (
                  <div key={item.id} className="flex flex-col gap-2">
                    <p>Nama Sesi: {item.sesi?.nama_sesi}</p>
                    <p>Nama Mapel: {item.mapel?.nama_mapel}</p>
                    <p>Nama Ruang: {item.ruang?.nama_ruang}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardKelompok;
