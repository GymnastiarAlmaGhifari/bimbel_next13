import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization;

    if (req.method === "GET") {
        try {
            const siswas = await prisma.siswa.findUnique({
                where: {
                    token: token,
                },
                include: {
                    kelompok: {
                        include: {
                            program: true,
                        },
                    },
                }
            });
            if (!siswas) {
                return res.status(404).json({
                    status: 404,
                    message: "Pengguna tidak ditemukan",
                    data: {},
                });
            }

            try {
                const mapel = await prisma.mapel.findMany({
                    where: {
                        kelas_id: siswas.kelompok?.program.kelas_id,
                    },
                });

                if (!mapel) {
                    return res.status(404).json({
                        status: 404,
                        message: "Mapel tidak ditemukan",
                        data: {},
                    });
                }

                const modulsArray: {
                    modul_id: string;
                    nama_modul: any;
                    url: string;
                    nama_mapel: string | undefined;
                }[] = [];

                let moduls;

                const count = mapel.length;

                for (let i = 0; i < count; i++) {

                    const modul = await prisma.module.findMany({
                        where: {
                            mapel_id: mapel[i].id,
                        },
                        include: {
                            mapel: true,
                        },
                    });

                    moduls = modul.map((modul) => ({
                        modul_id: modul.id,
                        nama_modul: modul.nama_module,
                        url: modul.url,
                        nama_mapel: modul.mapel?.nama_mapel,
                    }));

                    modulsArray.push(...moduls);
                    console.log("asjksdhkj", modulsArray);
                }

                if (modulsArray.length === 0) {
                    return res.status(404).json({
                        status: 404,
                        message: "Modul kosong",
                        data: {},
                    });
                } else {
                    res.status(200).json({
                        status: 200,
                        message: "Berhasil mendapatkan data modul",
                        data: modulsArray
                    });
                }

            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    status: 500,
                    message: "Error mendapatkan data mapel.",
                    data: { error },
                });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: "Error mendapatkan data siswa.",
                data: { error },
            });

        }
    }
}