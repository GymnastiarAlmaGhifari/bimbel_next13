import { FC } from "react";
import Image from "next/image";
import Button from "@/pages/components/buttons/Button";

interface Nota {
    data: any;
    onClose: () => void;
}

const LihatNota: FC<Nota> = ({ data, onClose }) => {
    return (
        <div>
            <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
                <div className="flex justify-between">
                    <div className="flex items-center h-max w-auto gap-3">
                        <div className="h-14 w-14">
                            <Image
                                src={data.nota ? data.nota : "/img/user/default.png"}
                                alt="Megachan"
                                width={100}
                                height={100}
                                className="rounded-full w-full h-full object-cover"
                                loader={({ src }) => `${src}?cache-control=no-store`}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className=" text-Neutral-10 font-bold">{data.nama_siswa}</h1>
                            <div className="flex flex-col  gap-1">
                                <h3 className="text-Neutral-30">{data.Bulan} - {data.Tahun}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    center
                    bgColor="bg-Neutral-70"
                    brColor=""
                    label="Batal"
                    textColor="text-Neutral-30"
                    type="button"
                    onClick={onClose}
                />
            </div>
        </div>
    )
}

export default LihatNota