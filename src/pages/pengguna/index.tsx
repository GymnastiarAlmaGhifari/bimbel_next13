import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import React, { FC, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { ModalDetail } from "@/pages/components/modal/Modal";
import UserEdit from "./edit";
import Navbar from "../components/Navbar";
import Create from "./create";
import HeadTable from "../components/HeadTable";
import UserCard from "../components/card/CardPengguna";
import { useSession } from "next-auth/react";
import UserEditGambar from "./edit/editgambar";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  nomor_telepon: string;
  mapel_id: string;
  mapel: any;
  universitas: string;
  nama_mapel: string;
  alamat: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
}

const User: FC<User> = () => {
  const { data: session, status } = useSession();

  const { data: users, error } = useSWR<User[]>("/api/user", fetcher, {});

  const { data: admin, error: erroradmin } = useSWR<User[]>(
    "/api/user/getadmin",
    fetcher,
    {}
  );

  const [selected, setSelected] = useState<User | null>(null);

  // select gambar open modal edit gambar
  const [selectedGambar, setSelectedGambar] = useState<User | null>(null);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const backPengguna = () => {
    setSelected(null);
  };

  const [showCreate, setShowCreate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccess(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-10 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable
              label="Pengguna"
              role
              onClick={() => {
                setShowCreate(true);
              }}
            />

            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              {session?.user.role === "SUPER" && (
                <>
                  {users ? (
                    <>
                      {users.length === 0 ? (
                        <p>No program found.</p>
                      ) : (
                        users.map((user) => (
                          <UserCard
                            key={user.id}
                            nama_user={user.name}
                            universitas={user.universitas}
                            nama_mapel={user.mapel?.nama_mapel}
                            gambar={user?.image}
                            role={user.role}
                            onClick={() => {
                              setSelected(user);
                            }}
                            editGambar={
                              () => {
                                setSelectedGambar(user);
                              }
                            }
                          />
                        ))
                      )}
                    </>
                  ) : (
                    <p>Loading...</p>
                  )}
                </>
              )}

              {session?.user.role === "ADMIN" && (
                <>
                  {admin ? (
                    <>
                      {admin.length === 0 ? (
                        <p>No program found.</p>
                      ) : (
                        admin.map((admin) => (
                          <UserCard
                            key={admin.id}
                            nama_user={admin.name}
                            universitas={admin.universitas}
                            nama_mapel={admin.mapel?.nama_mapel}
                            gambar={admin?.image}
                            role={admin.role}
                            onClick={() => {
                              setSelected(admin);
                            }}
                          />
                        ))
                      )}
                    </>
                  ) : (
                    <p>Loading...</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {selected && (
        <ModalDetail
          titleModal="Edit Pengguna"
          onClose={backPengguna}
        >
          <UserEdit
            userId={selected.id}
            onClose={backPengguna}
            onSucsess={() => {
              setShowSuccess(true);
            }}
            data={selected}
          />
        </ModalDetail>
      )}

      {/* buat modal dari getname  */}
      {showSuccess && (
        <ModalDetail
          titleModal="Modal Pengguna"
          onClose={() => setShowSuccess(false)}
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-green-500">Berhasil</h1>
            <p className="text-sm text-gray-500">
              {selected?.name}Data berhasil diubah
            </p>
          </div>
        </ModalDetail>
      )}

      {/* modal create */}
      {showCreate && (
        <ModalDetail
          titleModal="Tambah Pengguna"
          onClose={() => setShowCreate(false)}
        >
          <Create
            onClose={() => setShowCreate(false)}
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      )}

      {/* modal edit gambar */}
      {selectedGambar && (
        <ModalDetail
          titleModal="Edit Gambar"
          onClose={() => setSelectedGambar(null)}
        >
          <UserEditGambar
            userId={selectedGambar.id}
            onClose={() => setSelectedGambar(null)}
            onSucsess={() => {
              setShowSuccess(true);
            }}
            data={selectedGambar}
          />
        </ModalDetail>
      )}
    </div>
  );
};

export default User;
