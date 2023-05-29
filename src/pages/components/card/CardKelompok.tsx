import { FC, useCallback, useEffect, useState } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import { MdModeEdit, MdDelete, MdOutlineInfo } from "react-icons/md";

import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosAdd,
  IoLogoWhatsapp,
} from "react-icons/io";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import Image from "next/image";
import { ModalDetail } from "../modal/Modal";
import DetailSiswa from "@/pages/siswa/detail";
import DeleteSiswa from "@/pages/kelompok/rmanggota";
import DeleteJadwal from "@/pages/kelompok/deletejadwal";


interface CardKelompokProps {
  id?: string;
  nama_program: string;
  level: string;
  tipe: string;
  nama_kelompok: string;
  jumlah_siswa: number;
  jumlah_jadwal: number;
  onClick: () => void;
  onDetail: () => void;
  addAnggota: () => void;
  addJadwal: () => void;
}

interface Jadwal {
  id: string;
  hari: string;
  sesi_id: string;
  mapel_id: string;
  image: string;
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

interface siswa {
  id: string;
  email: string;
  name: string;
  nomor_telepon: string;
  alamat: string;
  sekolah: string;
  hp_ortu: string;
  image: string;
}

const CardKelompok: FC<CardKelompokProps> = ({
  id,
  nama_kelompok,
  nama_program,
  tipe,
  level,
  jumlah_siswa,
  jumlah_jadwal,
  onDetail,
  onClick,
  addAnggota,
  addJadwal,
}) => {
  const [isExpandedDetails, setIsExpandedDetails] = useState(false);
  const [isExpandedJadwal, setIsExpandedJadwal] = useState(false);
  const [idKelompok, setIdKelompok] = useState("");

  const handleDetailsClick = () => {
    setIsExpandedDetails(!isExpandedDetails);
    if (isExpandedJadwal == true) {
      setIsExpandedJadwal(false);
    }
  };

  const handleJadwalClick = () => {
    setIsExpandedJadwal(!isExpandedJadwal);
    if (isExpandedDetails == true) {
      setIsExpandedDetails(false);
    }
  };

  const handleShowDetails = () => {
    setIdKelompok(id || "");
    handleDetailsClick();
  };

  const handleLihatJadwal = () => {
    setIdKelompok(id || "");
    handleJadwalClick();
  };


const [siswaIdDetail, setSiswaIdDetail] = useState(null); 
const [siswaIdDelete, setSiswaIdDelete] = useState<siswa | null>(null);
const [jadwalIdDelete, setJadwalIdDelete] = useState<siswa | null>(null);
const [siswaHp, setSiswaHp] = useState(null);

  const {
    data: siswa,
    error: siswaError,
    isLoading,
  } = useSWR(`/api/kelompok/siswa/${idKelompok}`, fetcher);


  const {
    data: jadwal,
    error: jadwalError,
    isLoading: jadwalIsLoading,
  } = useSWR<Jadwal[]>(`/api/kelompok/jadwal/${idKelompok}`, fetcher, {
    shouldRetryOnError: false,
  });


  const whatsapp = "https://wa.me/62" + siswaHp + "?text=Hello";
  const openWhatsApp = () => {
    window.open(whatsapp);
  };

  return (
    <div
      className={`flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3 ${isExpandedDetails || isExpandedJadwal ? "h-max" : ""
        }`}
    >
      <div className="flex justify-between">
        <h1 className=" text-Primary-10 font-bold capitalize">
          {nama_kelompok}
        </h1>
        {/* <span className="text-Neutral-30">{tipe}</span> */}
        <div className="flex flex-col">
          <div className="flex flex-col items-end gap-1 justify-center">
            <h3 className="text-sm text-Neutral-30">Jumlah Anggota</h3>
            <span className="font-bold text-Primary-10">{
              jumlah_siswa == 0 ? "Belum ada siswa" : jumlah_siswa
            }</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 justify-center">
          <h3 className="text-sm text-Neutral-30">Progam</h3>
          <span className="font-bold text-Primary-10">{nama_program}</span>
        </div>
        <div className="flex flex-col gap-1 justify-center">
          <h3 className="text-sm text-Neutral-30">Tipe</h3>
          <span className="font-bold text-Primary-10">{tipe}</span>
        </div>
        <div className="flex flex-col gap-1 justify-center">
          <h3 className="text-sm text-Neutral-30">Level</h3>
          <span className="font-bold text-Primary-10">{level}</span>
        </div>
        <div className="flex flex-col items-end gap-1 justify-center">
          <h3 className="text-sm text-Neutral-30">Jumlah Jadwal</h3>
          <span className="font-bold text-Primary-10">
            {
              jumlah_jadwal == 0 ? "Belum ada jadwal" : jumlah_jadwal
            }
          </span>
        </div>
        {/* <h3 className="text-sm text-Neutral-30 font-bold">{level}</h3> */}
      </div>
      <div className="w-full h-[1px] bg-Neutral-70"></div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            bgColor="bg-Primary-50"
            brColor=""
            label={isExpandedDetails ? "Tutup Anggota" : "Lihat Anggota"}
            textColor="text-Primary-20"
            type="button"
            onClick={handleShowDetails}
            icon={isExpandedDetails ? IoIosArrowUp : IoIosArrowDown}
          />
          <Button
            bgColor="bg-Primary-50"
            brColor=""
            label={isExpandedJadwal ? "Tutup Jadwal" : "Lihat Jadwal"}
            textColor="text-Primary-20"
            type="button"
            icon={isExpandedJadwal ? IoIosArrowUp : IoIosArrowDown}
            onClick={handleLihatJadwal}
          />
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            bgColor="bg-Tertiary-50"
            brColor=""
            label="Tambah Anggota"
            textColor="text-Tertiary-50"
            icon={IoIosAdd}
            onClick={addAnggota}
          />
          <Button
            type="button"
            bgColor="bg-Tertiary-50"
            brColor=""
            label="Tambah Jadwal"
            textColor="text-Tertiary-50"
            icon={IoIosAdd}
            onClick={addJadwal}
          />
          <Button
            type="button"
            bgColor="bg-Tertiary-50"
            brColor=""
            label="Edit Kelompok"
            textColor="text-Tertiary-50"
            icon={MdModeEdit}
            onClick={onClick}
          />
          <Button
            type="button"
            bgColor="bg-Error-50"
            brColor=""
            label="Hapus Kelompok"
            textColor="text-Error-50"
            icon={MdDelete}
            onClick={onClick}
          />
        </div>
      </div>
      <div className="">
        {isExpandedDetails && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {siswaError ? (
              <p>Error fetching siswa data.</p>
            ) : isLoading ? (
              <div>Loading...</div>
            ) : siswa && siswa.length > 0 ? (
              siswa.map((student: any, index: number) => (
                <div
                  key={student.id}
                  className="flex p-4 bg-gradient-to-br from-Tertiary-60 to-Primary-50 w-full rounded-lg "
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2 items-center">
                      <div className="w-10 h-10 rounded-full overflow-clip scale-100">
                        <Image
                          src={`/api/siswa/img?img=${student.image}`}
                          alt="profile"
                          width={30}
                          height={30}
                          className="rounded-full w-full h-full object-cover"
                          loader={({ src }) => `${src}?cache-control=no-store`}
                        />
                      </div>
                      <div className="">
                        <p className="font-bold text-Neutral-100">
                          {student.nama}
                        </p>
                        <p className="text-sm text-Neutral-100">
                          {student.sekolah}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        bgColor="bg-Neutral-100"
                        brColor=""
                        withBgColor
                        noLabel
                        label="Info"
                        textColor="text-Primary-40"
                        type="button"
                        icon={IoLogoWhatsapp}
                        onClick={
                          () => {
                            setSiswaHp(student.nomor_telepon)
                            console.log(student.nomor_telepon)
                            openWhatsApp()
                          }
                        }
                      />
                      <Button
                        bgColor="bg-Neutral-100"
                        brColor=""
                        withBgColor
                        noLabel
                        label="Info"
                        textColor="text-Tertiary-50"
                        type="button"
                        onClick={
                          () => {
                            setSiswaIdDetail(student.id)
                          }
                        }
                        icon={MdOutlineInfo}
                      />
                      <Button
                        bgColor="bg-Neutral-100"
                        withBgColor
                        brColor=""
                        noLabel
                        label="Hapus"
                        textColor="text-Error-50"
                        type="button"
                        icon={MdDelete}
                        onClick={
                          () => {
                            setSiswaIdDelete(student)
                          }
                        }
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Tidak ada siswa yang tersedia.</p>
            )}
          </div>
        )}

        {isExpandedJadwal && (
          <div className="">
            {jadwalError ? (
              <p>Error fetching jadwal data.</p>
            ) : jadwalIsLoading ? (
              <div>Loading...</div>
            ) : jadwal && jadwal.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                {jadwal.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5  bg-gradient-to-br from-Tertiary-60 to-Primary-50 p-4 rounded-lg"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="">
                          <h1 className="font-bold text-Neutral-100">
                            {item?.hari}
                          </h1>

                          <span className="font-bold text-sm text-Neutral-100">
                            {item?.ruang.nama_ruang}
                          </span>
                        </div>
                        <h1 className="font-bold text-Neutral-100">
                          {item.sesi?.nama_sesi}
                        </h1>
                      </div>
                      <div className="flex w-full justify-between">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-sm text-Neutral-100">
                            Mata Pelajaran
                          </h3>
                          <span className="font-bold text-sm text-Neutral-100">
                            {item.mapel?.nama_mapel}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                          <h3 className="text-sm text-Neutral-100">Jam</h3>
                          <span className="font-bold text-sm text-Neutral-100">
                            {item.sesi.jam_mulai} - {item.sesi.jam_selesai}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm text-Neutral-100">User</h3>
                        <span className="font-bold text-sm text-Neutral-100">
                          {item?.user.name}
                        </span>
                      </div>
                      <Button
                        bgColor="bg-Neutral-100"
                        withBgColor
                        brColor=""
                        label="Hapus"
                        textColor="text-Error-50"
                        type="button"
                        icon={MdDelete}
                        onClick={
                          () => {
                            setJadwalIdDelete(item)
                          }
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Tidak ada jadwal yang tersedia.</p>
            )}
          </div>
        )}
      </div>
      {siswaIdDetail && (
        <ModalDetail
          titleModal="Detail Siswa"
          onClose={() => setSiswaIdDetail(null)}
        >
          <DetailSiswa
            idSiswa={siswaIdDetail}
            onClose={() => setSiswaIdDetail(null)}
          />
        </ModalDetail>
      )}
      {siswaIdDelete && (
        <ModalDetail
          titleModal="Delete Siswa"
          onClose={() => setSiswaIdDelete(null)}
          center
          silang
          wAuto
        >
          <DeleteSiswa
          idSiswa={siswaIdDelete.id}
          onClose={() => setSiswaIdDelete(null)}
          onSuccess={
            () => {
              setSiswaIdDelete(null)
            }
          }
          data={siswaIdDelete}
          kelompokId={idKelompok}
          />
        </ModalDetail>
      )}
      {jadwalIdDelete && (
        <ModalDetail
          titleModal="Delete Jadwal"
          onClose={() => setJadwalIdDelete(null)}
          center
          silang
          wAuto
        >
          <DeleteJadwal
          idJadwal={jadwalIdDelete.id}
          onClose={() => setJadwalIdDelete(null)}
          onSuccess={
            () => {
              setJadwalIdDelete(null)
            }
          }
          data={jadwalIdDelete} 
          kelompokId={idKelompok}
          />
        </ModalDetail>
      )}

       
    </div>
  );
};

export default CardKelompok;
