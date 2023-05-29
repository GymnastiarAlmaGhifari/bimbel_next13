import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import React, { FC, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { ModalDetail, ModalSucces } from "@/pages/components/modal/Modal";
import UserEdit from "./edit";
import Navbar from "../components/Navbar";
import Create from "./create";
import HeadTable from "../components/HeadTable";
import UserCard from "../components/card/CardPengguna";
import { useSession } from "next-auth/react";
import UserEditGambar from "./edit/editgambar";
import Search from "../components/Search";
import DeletePengguna from "./delete";

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
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  const { data: session, status } = useSession();

  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  const {
    data: users,
    error,
    isLoading: superload,
  } = useSWR<User[]>(`/api/user`, fetcher, {});

  let filteredUsers = users;

  if (debouncedValue) {
    filteredUsers = users?.filter((user) =>
      user.name.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }

  const {
    data: admin,
    error: erroradmin,
    isLoading: adminload,
  } = useSWR<User[]>("/api/user/getadmin", fetcher, {});

  let filteredAdmin = admin;

  if (debouncedValue) {
    filteredAdmin = admin?.filter((user) =>
      user.name.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }

  const [selected, setSelected] = useState<User | null>(null);

  // delete selected
  const [selecteDelete, setSelecteDelete] = useState<User | null>(null);

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
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="flex flex-row h-screen w-screen absolute overflow-hidden font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable
              label="Pengguna"
              onClick={() => {
                setShowCreate(true);
              }}
              // buat onchange onChange={(value) => setInputValue(value)}
              onChange={handleInputChange}
            />

            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              {session?.user.role === "SUPER" && (
                <>
                  {superload ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      {filteredUsers?.length === 0 ? (
                        <p>Tidak ditemukan pengguna.</p>
                      ) : (
                        filteredUsers?.map((user) => (
                          <UserCard
                            key={user.id}
                            nama_user={user.name}
                            universitas={user.universitas}
                            nama_mapel={user.mapel?.nama_mapel}
                            gambar={user?.image}
                            role={user.role}
                            onEdit={() => {
                              setSelected(user);
                            }}
                            onHapus={() => {
                              setSelecteDelete(user);
                            }}
                          />
                        ))
                      )}
                    </>
                  )}
                </>
              )}

              {session?.user.role === "ADMIN" && (
                <>
                  {adminload ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      {filteredAdmin?.length === 0 ? (
                        <p>Tidak ditemukan pengguna.</p>
                      ) : (
                        filteredAdmin?.map((user) => (
                          <UserCard
                            key={user.id}
                            nama_user={user.name}
                            universitas={user.universitas}
                            nama_mapel={user.mapel?.nama_mapel}
                            gambar={user?.image}
                            role={user.role}
                            onEdit={() => {
                              setSelected(user);
                            }}
                            onHapus={() => {
                              setSelecteDelete(user);
                            }}
                          />
                        ))
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {selected && (
        <ModalDetail titleModal="Edit Pengguna" onClose={backPengguna}>
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
        <ModalSucces label="" onClose={() => setShowSuccess(false)}>
          {/* <div className="flex flex-col items-center justify-center">
            <h1 className=" font-bold text-green-500">Berhasil</h1>
            <p className="text-sm text-gray-500">
              {selected?.name}Data berhasil diubah
            </p>
          </div> */}
        </ModalSucces>
      )}

      {/* modal hapus */}
      {selecteDelete && (
        <ModalDetail
          titleModal="Hapus Pengguna"
          onClose={() => setSelecteDelete(null)}
          silang
          center
          wAuto
        >
          <DeletePengguna
            idPengguna={selecteDelete.id}
            onClose={() => setSelecteDelete(null)}
            onSuccess={() => {
              setShowSuccess(true);
            }}
            data={selecteDelete}
          />
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
    </div>
  );
};

export default User;
