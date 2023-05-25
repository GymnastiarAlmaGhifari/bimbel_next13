import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import fetcher from "@/libs/fetcher";
import { IoMdCloudUpload, IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface Senin {
    jadwalId: string;
    data: any;
    idRuang: string;
    onClose: () => void;
    onSucsess: () => void;
}

interface Kelompok {
    id: string;
    nama_kelompok: string;
    program: {
        id: string;
        nama_program: string;
        kelas_id: string;
    };
}

interface Sesi {
    id: string;
    nama_sesi: string;
}

interface Ruang {
    id: string;
    nama_ruang: string;
}

interface Mapel {
    id: string;
    nama_mapel: string;
    kelas: {
        id: string;
    }

}

interface User {
    id: string;
    name: string;
    mapel_id: string;
}

const schema = yup.object().shape({

    kelompokCheck: yup.mixed().nullable().transform((value, originalValue) => {
        if (originalValue === '') {
            return null; // Mengubah string kosong menjadi nilai null
        }
        return originalValue;
    }),
    userCheck: yup.mixed().nullable().transform((value, originalValue) => {
        if (originalValue === '') {
            return null; // Mengubah string kosong menjadi nilai null
        }
        return originalValue;
    }),
    sesi: yup.string(),
    mapel: yup.string(),
    ruang: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const Senin: FC<Senin> = ({ jadwalId, data, onClose, onSucsess, idRuang }) => {
    const { data: kelompok, error: errorKelompok } = useSWR<Kelompok[]>("api/kelompok", fetcher, {});
    const { data: sesi, error: errorSesi } = useSWR<Sesi[]>("api/sesi", fetcher, {});
    const { data: mapel, error: errorMapel } = useSWR<Mapel[]>("api/mapel", fetcher, {});
    const { data: ruang, error: errorRuang } = useSWR<Ruang[]>("api/ruang", fetcher, {});
    const { data: user, error: errorUser } = useSWR<User[]>("api/user", fetcher, {});


    const [isLoading, setIsLoading] = useState(false);

    const [selectedOptionUser, setSelectedOptionUser] = useState<User | null>(null);
    const [isListOpenSesi, setIsListOpenSesi] = useState(false);
    const [isListOpenRuang, setIsListOpenRuang] = useState(false);
    const [isListOpenMapel, setIsListOpenMapel] = useState(false);
    const componentRef = useRef<HTMLUListElement>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    // buat let untuk menampung data kelompokCheck yang apabila berubah akan mutate mapel sesuai dengan id kelas yang dipilih
    const [selectedOption, setSelectedOption] = useState<Kelompok | null>(null);
    const [debouncedValue, setDebouncedValue] = useState<string>("");

    watch('kelompokCheck');
    watch('userCheck');

    useEffect(() => {
        // Menangani klik di luar komponen
        const handleOutsideClick = (event: any) => {
            if (
                componentRef.current &&
                !componentRef.current.contains(event.target)
            ) {
                setIsListOpenSesi(false);
                setIsListOpenRuang(false);
                setIsListOpenMapel(false);

            }
        };

        // Menambahkan event listener ketika komponen di-mount
        document.addEventListener("mousedown", handleOutsideClick);

        // Membersihkan event listener ketika komponen di-unmount
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [
        setIsListOpenSesi,
        setIsListOpenRuang,
        setIsListOpenMapel,
        componentRef
    ]
    );

    const [checkValue, setCheckValue] = useState<string>("");
    const [checkValueUser, setCheckValueUser] = useState<string>("");

    let filteredMapel = mapel
    let filteredUser = user

    if (checkValue) {
        filteredMapel = mapel?.filter((mapelItem) => {
            return mapelItem.kelas.id === checkValue; // Add 'return' statement
        });
    }

    if (checkValueUser) {
        filteredUser = user?.filter((userItem) => {
            return userItem.mapel_id === checkValueUser; // Add 'return' statement
        });
    }

    const handleCheckChangeUser = (value: string) => {
        setCheckValueUser(value)
    }

    const handleCheckChange = (value: string) => {
        setCheckValue(value)
    }


    const toggleListSesi = () => {
        setIsListOpenSesi(!isListOpenSesi);
    };
    const toggleListRuang = () => {
        setIsListOpenRuang(!isListOpenRuang);
    };
    const toggleListMapel = () => {
        setIsListOpenMapel(!isListOpenMapel);
    };
    const selectSesi = (sesi: string) => {
        setValue("sesi", sesi);
        setIsListOpenSesi(false);
    };
    const selectRuang = (ruang: string) => {
        setValue("ruang", ruang);
        setIsListOpenRuang(false);
    };
    const selectMapel = (mapel: string) => {
        setValue("mapel", mapel);
        setIsListOpenMapel(false);
    };

    useEffect(() => {
        // Saat data di-load, centang checkbox sesuai dengan data yang ada di database

        if (data) {
            setSelectedOption(data.kelompok);
            setValue('kelompokCheck', data.kelompok?.id);
            setSelectedOptionUser(data.user);
            setValue('userCheck', data.user?.id);
            setValue('sesi', data.sesi?.id);
            setValue('mapel', data.mapel?.id);
            setValue('ruang', idRuang);
            // set handleCheckChange untuk filter mapel
            if (mapel?.length && mapel[0]?.kelas?.id) {
                setCheckValue(mapel[0].kelas.id);
            } else if (kelompok?.length && kelompok[0]?.program?.kelas_id) {
                setCheckValue(kelompok[0].program.kelas_id);
            }
            // set handleCheckChangeUser untuk filter User
            if (user?.length && user[0]?.mapel_id) {
                setCheckValueUser(user[0].mapel_id);
            }
            else if (user?.length && user[0]?.mapel_id) {
                setCheckValueUser(user[0].mapel_id);
            }

        }
    }, [kelompok, setValue, data, mapel, idRuang, user]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        let { kelompokCheck } = data;
        if (Array.isArray(kelompokCheck)) {
            kelompokCheck = kelompokCheck[0].toString();
        }

        let { userCheck } = data;
        if (Array.isArray(userCheck)) {
            userCheck = userCheck[0].toString();
        }

        const { sesi, mapel, ruang } = data;
        const payload = {
            kelompok_id: kelompokCheck,
            user_id: userCheck,
            sesi_id: sesi,
            mapel_id: mapel,
            ruang_id: ruang,
        };
        console.log("jsnnnn", payload);

        setIsLoading(true);

        try {
            const response = await axios.put(`/api/jadwaldetail/${jadwalId}`, payload);
            console.log(response.data);

            mutate(`/api/jadwaldetail/${jadwalId}`);
            mutate(`/api/jadwal/hari?hari=SENIN&ruang_id=${idRuang}`, undefined)
            mutate(`/api/jadwal/hari?hari=SELASA&ruang_id=${ruang}`, undefined)

            onSucsess();
            onClose();

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }


        // console.log(data);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{jadwalId}</h1>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                    <div className="flex flex-col">
                        {kelompok?.map((item: Kelompok) => (
                            <label key={item.id}>
                                <input
                                    type="checkbox"
                                    value={item.id}
                                    checked={selectedOption?.id === item.id}
                                    {...register("kelompokCheck")}
                                    onChange={
                                        () => {
                                            if (selectedOption?.id === item.id) {
                                                // Jika item yang dipilih adalah yang saat ini dipilih, tidak melakukan apa-apa
                                                return;
                                            }
                                            setSelectedOption(selectedOption?.id === item.id ? null : item);
                                            setValue('kelompokCheck', item.id);
                                            handleCheckChange(item.program.kelas_id);
                                        }
                                    }
                                />
                                {item.nama_kelompok} - {item.program.nama_program}
                            </label>
                        ))}
                        {
                            errors.kelompokCheck && <span className="text-sm text-red-500">Kelompok harus dipilih</span>
                        }


                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="" className="text-sm text-Primary-10">
                                    Sesi
                                </label>

                                <div className="relative flex flex-col gap-2">
                                    <button
                                        type="button"
                                        className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenSesi
                                            ? "border-[2px] border-Primary-50 bg-Primary-95"
                                            : "bg-Neutral-95"
                                            }`}
                                        onClick={toggleListSesi}
                                    >
                                        {/* buat label */}
                                        {watch("sesi") ? (
                                            sesi?.find((sesiItem) => sesiItem.id === watch("sesi"))
                                                ?.nama_sesi
                                        ) : (
                                            <span className="text-Neutral-300">Pilih Sesi</span>
                                        )}
                                        {isListOpenSesi ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </button>
                                    {isListOpenSesi && (
                                        <ul className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1" ref={componentRef}>
                                            {errorSesi ? (
                                                <li>Error fetching data</li>
                                            ) : !sesi ? (
                                                <li>Loading...</li>
                                            ) : sesi.length === 0 ? (
                                                <li>No classes available</li>
                                            ) : (
                                                sesi.map((sesiItem) => (
                                                    <li key={sesiItem.id}>
                                                        <button
                                                            type="button"
                                                            className={`w-full text-left px-2 py-1 rounded-full ${watch("sesi") === sesiItem.id
                                                                ? "text-Primary-90 bg-Primary-20"
                                                                : "text-Primary-20 hover:bg-Primary-95"
                                                                }`}
                                                            onClick={() =>
                                                                selectSesi(sesiItem.id)

                                                            }
                                                        >
                                                            {sesiItem.nama_sesi}
                                                        </button>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    )}
                                </div>
                                {errors.sesi && (
                                    <span className="text-red-500">{errors.sesi.message}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="" className="text-sm text-Primary-10">
                                    ruang
                                </label>

                                <div className="relative flex flex-col gap-2">
                                    <button
                                        type="button"
                                        className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenRuang
                                            ? "border-[2px] border-Primary-50 bg-Primary-95"
                                            : "bg-Neutral-95"
                                            }`}
                                        onClick={toggleListRuang}
                                    >
                                        {/* buat label */}
                                        {watch("ruang") ? (
                                            ruang?.find((ruangItem) => ruangItem.id === watch("ruang"))
                                                ?.nama_ruang
                                        ) : (
                                            <span className="text-Neutral-300">Pilih Ruang</span>
                                        )}
                                        {isListOpenRuang ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </button>
                                    {isListOpenRuang && (
                                        <ul className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1" ref={componentRef}>
                                            {errorRuang ? (
                                                <li>Error fetching data</li>
                                            ) : !ruang ? (
                                                <li>Loading...</li>
                                            ) : ruang.length === 0 ? (
                                                <li>No classes available</li>
                                            ) : (
                                                ruang.map((ruangItem) => (
                                                    <li key={ruangItem.id}>
                                                        <button
                                                            type="button"
                                                            className={`w-full text-left px-2 py-1 rounded-full ${watch("ruang") === ruangItem.id
                                                                ? "text-Primary-90 bg-Primary-20"
                                                                : "text-Primary-20 hover:bg-Primary-95"
                                                                }`}
                                                            onClick={() => selectRuang(ruangItem.id)}
                                                        >
                                                            {ruangItem.nama_ruang}
                                                        </button>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    )}
                                </div>
                                {errors.ruang && (
                                    <span className="text-red-500">{errors.ruang.message}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm text-Primary-10">
                                Mapel
                            </label>

                            <div className="relative flex flex-col gap-2">
                                <button
                                    type="button"
                                    className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenMapel
                                        ? "border-[2px] border-Primary-50 bg-Primary-95"
                                        : "bg-Neutral-95"
                                        }`}
                                    onClick={toggleListMapel}
                                >
                                    {/* buat label */}
                                    {watch("mapel") ? (
                                        mapel?.find((mapelItem) => mapelItem.id === watch("mapel"))
                                            ?.nama_mapel
                                    ) : (
                                        <span className="text-Neutral-300">Pilih Mapel</span>
                                    )}
                                    {isListOpenMapel ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                </button>
                                {isListOpenMapel && (
                                    <ul className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1" ref={componentRef}>
                                        {
                                            filteredMapel?.map((mapelItem) => (
                                                <li key={mapelItem.id}>
                                                    <button
                                                        type="button"
                                                        className={`w-full text-left px-2 py-1 rounded-full ${watch("mapel") === mapelItem.id
                                                            ? "text-Primary-90 bg-Primary-20"
                                                            : "text-Primary-20 hover:bg-Primary-95"
                                                            }`}
                                                        onClick={() => {
                                                            selectMapel(mapelItem.id)
                                                            handleCheckChangeUser(mapelItem.id)
                                                        }}
                                                    >
                                                        {mapelItem.nama_mapel}
                                                    </button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                )}
                            </div>
                            {errors.mapel && (
                                <span className="text-red-500">{errors.mapel.message}</span>
                            )}
                        </div>
                        {filteredUser?.map((item: User) => (
                            <label key={item.id}>
                                <input
                                    type="checkbox"
                                    value={item.id}
                                    checked={selectedOptionUser?.id === item.id}
                                    {...register("userCheck")}
                                    onChange={
                                        () => {
                                            if (selectedOptionUser?.id === item.id) {
                                                // Jika item yang dipilih adalah yang saat ini dipilih, tidak melakukan apa-apa
                                                return;
                                            }
                                            setSelectedOptionUser(selectedOptionUser?.id === item.id ? null : item);
                                            setValue('userCheck', item.id);
                                        }
                                    }
                                />
                                {item.name}
                            </label>
                        ))}
                        {errors.kelompokCheck && <p>{errors.kelompokCheck.message}</p>}
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Senin;
