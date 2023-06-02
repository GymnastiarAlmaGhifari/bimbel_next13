import Image from "next/image";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/buttons/Button";
import { MdModeEdit } from "react-icons/md";
import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { useSession } from "next-auth/react";
import { ModalDetail } from "../components/modal/Modal";
import EditProfile from "./edit";

interface Profile {
  id: string;
  email: string;
  name: string;
  nomor_telepon: string;
  universitas: string;
  mata_pelajaran: string;
  alamat: string;
  image: string;
  role: string;
}

const Profile: FC<Profile> = () => {
  const session = useSession();

  const id = session?.data?.user.id;

  const { data: profile, error, isLoading } = useSWR<Profile>(
    `/api/user/${id}`,
    fetcher,
    {}
  );


  const [edit, setEdit] = useState<string | null>(null);

  const idProfil = profile?.id ?? null;

  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className=" w-full flex flex-col">
        <div className="flex flex-col h-full">
          <Navbar />
          <div className="h-full bg-Neutral-95 relative">
            <div className="w-full h-1/2 bg-gradient-to-br from-Tertiary-50 to-Primary-50">
              <div className="absolute h-full flex items-center justify-center w-full">
                {
                  isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-Primary-50"></div>
                    </div>
                  ) : (
                    // map here
                    <div className="flex gap-20 w-max bg-Neutral-100 relative shadow-[0px_0px_6px_1px_rgba(0,0,0,.2)] p-20 rounded-lg">
                      <div className="flex flex-col gap-6 w-max items-center">
                        <div className="h-72 w-60 rounded-lg ring-[8px] ring-Neutral-100 ">
                          <Image
                            src={profile?.image ? "/api/user/img?img=" + profile?.image : "/img/user/default.png"}
                            alt="Foto profile"
                            width={100}
                            height={100}
                            className="rounded-lg w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-3 items-center w-full">
                          <h1 className="font-bold text-Primary-10 text-lg">
                            {profile?.name}
                          </h1>
                          <h2 className="inline-block py-2 px-4 bg-Primary-50 text-Primary-10 rounded-full font-semibold w-full text-center">
                            {
                              profile?.role === "SUPER" ? "Super Admin" : profile?.role === "ADMIN" ? "Admin" : "Tentor"
                            }
                          </h2>
                        </div>
                      </div>
                      <div className="flex flex-col gap-5">
                        <div className="h-full flex flex-col gap-5">
                          <h1 className="font-bold text-Primary-20 text-xl">
                            Detail Info
                          </h1>
                          <div className="flex gap-[120px]">
                            <div className="flex flex-col gap-5">
                              <div className="flex flex-col gap-1">
                                <h3 className="text-sm text-Neutral-30">Email</h3>
                                <span className="font-bold text-Primary-10">
                                  {profile?.email}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <h3 className="text-sm text-Neutral-30">
                                  No WA/Telp
                                </h3>
                                <span className="font-bold text-Primary-10">
                                  {profile?.nomor_telepon}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <h3 className="text-sm text-Neutral-30">Alamat</h3>
                                <span className="font-bold text-Primary-10">
                                  {profile?.alamat ? profile?.alamat : "-"}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-5">
                              <div className="flex flex-col gap-1">
                                <h3 className="text-sm text-Neutral-30">Lulusan</h3>
                                <span className="font-bold text-Primary-10">
                                  {profile?.universitas ? profile?.universitas : "-"}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <h3 className="text-sm text-Neutral-30">
                                  Mata Pelajaran
                                </h3>
                                <span className="font-bold text-Primary-10">
                                  {
                                    profile?.mata_pelajaran ? profile?.mata_pelajaran : "-"
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            bgColor="bg-Tertiary-50"
                            brColor=""
                            withBgColor
                            label="Edit Profile"
                            textColor="text-Neutral-100"
                            type={"button"}
                            icon={MdModeEdit}
                            onClick={() => setEdit(
                              idProfil ? idProfil : null
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
              {
                edit && (
                  <ModalDetail
                    titleModal="Edit Profile"
                    onClose={() => setEdit(null)}
                  >
                    <EditProfile
                      data={profile}
                      onClose={() => setEdit(null)}
                      onSucsess={() => setEdit(null)}
                      userId={edit}
                    />
                  </ModalDetail>
                )

              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;