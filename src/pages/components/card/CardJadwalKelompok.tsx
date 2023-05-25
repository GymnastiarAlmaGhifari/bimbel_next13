import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";

type CardJadwalKelompokProps = {
    type?: string;
    id?: string;
    value?: string;
    register?: any;
    label?: string;
    nomor_telepon?: string;
    getValues?: any; // Tambahkan properti getValues
    setValue?: any; //
    groupName?: string;
    onChange?: any;
    checked?: any;
};

const CardJadwalKelompok: FC<CardJadwalKelompokProps> = ({
    type,
    id,
    value,
    register,
    label,
    nomor_telepon,
    getValues,
    setValue,
    groupName,
    onChange,
    checked,

}) => {
    // handle check sesuai dengan value yang diinputkan jika true maka akan menampilkan icon check

    useEffect(() => {
        // check sesuai dengan id yang terseleksi
    }, [getValues, value, id]);

    const [check, setCheck] = useState(false);

    const handleCheck = () => {
        onChange();
    };

    useEffect(() => {
        setCheck(checked);
    }, [checked]);

    return (
        <div onClick={handleCheck}>
            <div
                className={`flex flex-col gap-2 p-2 border-[2px] ${check ? "border-Primary-40" : ""
                    } w-full rounded-lg items-center bg-Neutral-100`}
            >
                <div className="flex justify-end w-full ">
                    <input
                        type={type}
                        id={id}
                        className="appearance-none"
                        value={value}
                        {...register}
                        onChange={onChange}
                        checked={checked}
                    />
                    <label htmlFor="id">
                        <div
                            className={`p-1 h-6 w-6 rounded-full ${check ? "bg-Primary-40" : "bg-Neutral-95"
                                }`}
                            onClick={handleCheck}
                        >
                            {check ? (
                                <HiOutlineCheck strokeWidth={3} className="text-Neutral-100" />
                            ) : (
                                ""
                            )}
                        </div>
                    </label>
                </div>
                <div className="w-16 h-16 rounded-fsull overflow-clip scale-100 bg-red-400">
                    <Image
                        alt="Foto Siswa"
                        src={
                            "https://indopolitika.com/wp-content/uploads/2014/05/Puan-Maharani.jpg"
                        }
                        height={500}
                        width={500}
                        className="rounded-full w-full h-full object-cover"
                    />
                </div>
                <div className="">
                    <p className="font-bold text-center">{label}</p>
                    <p className="text-sm text-center">{nomor_telepon}</p>
                </div>
            </div>
        </div>
    );
};

export default CardJadwalKelompok;
