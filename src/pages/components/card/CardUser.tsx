import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";

interface UserCard {
  nama_user: string;
  universitas: string;
  nama_mapel: string;
  onClick: () => void;
  role: string;
}

const UserCard: FC<UserCard> = ({
  nama_mapel,
  universitas,
  onClick,
  nama_user,
  role,
}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex items-center h-max w-auto gap-3">
          <div className="h-20 w-20">
            <Image
              src={
                "https://img.jakpost.net/c/2017/02/15/2017_02_15_21637_1487139254._large.jpg"
              }
              alt="Megachan"
              width={100}
              height={100}
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className=" text-Neutral-10 font-bold">{nama_user}</h1>
            {universitas && (
              <div className="flex flex-col  gap-1">
                <h3 className="text-sm text-Neutral-30">Asal Insitut</h3>
                <span className="font-bold text-sm text-Primary-10">
                  {universitas}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 justify-end">
          <h3 className="text-sm text-Neutral-30">Mata Pelajaran</h3>
          <span className="font-bold text-sm text-Primary-10">
            {nama_mapel}
          </span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-between">
        <h2 className="font-semibold text-Primary-10">{role}</h2>
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Pengguna"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default UserCard;
