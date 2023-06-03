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
import Search from "../components/Search";
import DeletePengguna from "./delete";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Button from "../components/buttons/Button";
import { useRouter } from "next/router";

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

  let filteredUsers: User[] | undefined = users;

  if (debouncedValue && filteredUsers) {
    filteredUsers = filteredUsers?.filter((user) =>
      user.name.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }

  const {
    data: admin,
    error: erroradmin,
    isLoading: adminload,
  } = useSWR<User[]>("/api/user/getadmin", fetcher, {});

  let filteredAdmin: User[] | undefined = admin;

  if (debouncedValue && filteredAdmin) {
    filteredAdmin = filteredAdmin?.filter((user) =>
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
  const PAGE_SIZE = 3;
  const MAX_PAGE_DISPLAY = 5; // Jumlah maksimal nomor halaman yang ditampilkan

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const router = useRouter();

  let paginatedUsers: User[] = [];
  let totalPages: number = 0;
  let pageNumbers: number[] = [];


  if (filteredUsers) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

    const startPage = Math.max(
      currentPage - Math.floor(MAX_PAGE_DISPLAY / 2),
      1
    );
    const endPage = Math.min(startPage + MAX_PAGE_DISPLAY - 1, totalPages);

    pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  let paginatedAdmin: User[] = [];

  if (session?.user.role === "ADMIN") {
    if (filteredAdmin) {
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      paginatedAdmin = filteredAdmin.slice(startIndex, endIndex);
      totalPages = Math.ceil(filteredAdmin.length / PAGE_SIZE);

      const startPage = Math.max(
        currentPage - Math.floor(MAX_PAGE_DISPLAY / 2),
        1
      );

      const endPage = Math.min(startPage + MAX_PAGE_DISPLAY - 1, totalPages);

      pageNumbers = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
    }
  }




  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex flex-row h-screen w-screen absolute overflow-hidden font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">

          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            {
              session?.user.role === "TENTOR" ? (
                <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
                  <h1 className="text-2xl font-bold text-gray-500">
                    Hanya Super Admin atau Admin yang bisa mengakses halaman ini
                  </h1>
                  {/* back to dashboard */}
                  <Button
                    type="button"
                    withBgColor
                    bgColor="bg-Primary-40"
                    brColor=""
                    label="Kembali"
                    icon={IoIosArrowBack}
                    textColor="text-Primary-95"
                    onClick={() => router.push("/dashboard")}
                  />
                </div>
              ) : (
                <>
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
                        {paginatedUsers ? (
                          <>
                            {paginatedUsers.length === 0 ? (
                              <p>Tidak ditemukan pengguna.</p>
                            ) : (
                              paginatedUsers.map((user) => (
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
                        ) : (
                          <p>Loading...</p>
                        )}
                      </>
                    )}

                    {session?.user.role === "ADMIN" && (
                      <>
                        {paginatedAdmin ? (
                          paginatedAdmin.length === 0 ? (
                            <p>Tidak ditemukan pengguna.</p>
                          ) : (
                            paginatedAdmin.map((user) => (
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
                          )
                        ) : (
                          <p>Loading...</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex justify-center gap-4">
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-4">
                        {!isFirstPage && (
                          <button
                            className="bg-Neutral-95 text-Primary-40 font-semibold py-2 px-3 rounded-full hover:bg-Primary-40 hover:text-Primary-95"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            <IoIosArrowBack size={16} />
                          </button>
                        )}
                        <div className="flex gap-2">
                          {pageNumbers.map((page) => (
                            <button
                              key={page}
                              className={`px-4 py-2 rounded-full font-semibold ${currentPage === page
                                ? "bg-Primary-40 text-Neutral-100"
                                : "text-Primary-40 hover:bg-Primary-95 hover:text-Primary-30"
                                }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        {!isLastPage && (
                          <button
                            className="bg-Neutral-95 text-Primary-40 font-semibold py-1 px-3 rounded-full hover:bg-Primary-40 hover:text-Primary-95"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            <IoIosArrowForward size={16} />
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                </>
              )
            }
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
