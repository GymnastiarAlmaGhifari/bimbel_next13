import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import { MdModeEdit, MdDelete } from "react-icons/md";
import EditSiswa from "@/pages/siswa/edit";

interface UserCard {
  nama_user: string;
  universitas: string;
  nama_mapel: string;
  onEdit: () => void;
  onHapus?: () => void;
  gambar?: any;
  role: string;
  // editGambar?: () => void;
}

const UserCard: FC<UserCard> = ({
  nama_mapel,
  universitas,
  onEdit,
  nama_user,
  gambar,
  role,
  onHapus,
  // editGambar,
}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex items-center h-max w-auto gap-3">
          <div className="h-14 w-14 border-[1px] border-Primary-50 rounded-full">
            <Image
              src={"/api/user/img?img=" + gambar ? "/api/user/img?img=" + gambar : "/upload/img/user/default.png"}
              alt="Megachan"
              width={100}
              height={100}
              className="rounded-full w-full h-full object-cover"
              loader={({ src }) => `${src}?cache-control=no-store`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className=" text-Neutral-10 font-bold capitalize">{nama_user}</h1>
            {universitas && (
              <div className="flex flex-col  gap-1">
                <h3 className="text-sm text-Neutral-30">Asal Insitut</h3>
                <span className="font-bold text-Primary-10">
                  {universitas}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 justify-end">
          <h3 className="text-sm text-Neutral-30">Mata Pelajaran</h3>
          <span className="font-bold text-Primary-10">
            {nama_mapel}
          </span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-Neutral-70"></div>
      <div className="flex justify-between">
        <h2 className="font-semibold text-Primary-10">
          {role === "ADMIN" && "Admin"}
          {role === "SUPER" && "Super Admin"}
          {role === "TENTOR" && "Tentor"}
        </h2>

        <div className="flex gap-4">
          <Button
            type="button"
            bgColor="bg-Error-50"
            brColor=""
            label="Hapus Pengguna"
            textColor="text-Error-50"
            icon={MdDelete}
            onClick={onHapus}
          />
          <Button
            type="button"
            bgColor="bg-Tertiary-50"
            brColor=""
            label="Edit Pengguna"
            textColor="text-Tertiary-50"
            icon={MdModeEdit}
            onClick={onEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
