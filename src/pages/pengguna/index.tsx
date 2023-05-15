import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import React, { FC, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { ModalDetail } from "@/pages/components/Modal";
import UserEdit from "./edit";
import Navbar from "../components/Navbar";
import Create from "./create";
import HeadTable from "../components/HeadTable";
import UserCard from "../components/card/CardPengguna";

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
  const { data: users, error } = useSWR<User[]>("/api/user", fetcher, {});
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const backPengguna = () => {
    setSelected(null);
  };

  // open modal create
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
        <div className="h-full p-10 bg-Neutral-95 ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
            <HeadTable
              label="Pengguna"
              role
              onClick={() => {
                setShowCreate(true);

              }
            } />
            
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
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
                        onClick={
                          () => {
                            setSelected(user);
                          }
                        }
                      />
                    ))
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {selected && (
        <ModalDetail
          titleModal="Edit Pengguna"
          onOpen={true}
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
          titleModal="Edit Pengguna"
          onOpen={true}
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
          onOpen={true}
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
    </div>
  );
};

export default User;
