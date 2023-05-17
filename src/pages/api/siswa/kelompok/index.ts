import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization;

    if (req.method === "GET") {
        try {
            const siswakelompok = await prisma.siswa.findUnique({
                where: {
                    token: token,
                },
                include: {
                    kelompok: true,
                },
            });
            if (!siswakelompok) {
                return res.status(404).json({ 
                    status: 404,
                    message: "User not found",
                    data: {},
                 });
            } else {
                const kelompok = siswakelompok.kelompok;
                if (!kelompok) {
                    return res.status(404).json({
                        status: 404, 
                        message: "Siswa tidak memiliki kelompok",
                        data: {},
                     });
                }
                try {
                    const datakelompok = await prisma.kelompok.findUnique({
                        where: {
                            id: kelompok.id,
                        },
                        include: {
                            program: {
                                include: {
                                    kelas: true,
                                },
                            },
                        },
                    });

                    const kelompoksiswa = await prisma.siswa.findMany({
                        where: {
                            kelompok_id: kelompok.id,
                        },
                    });

                    const anggotaArray: {
                        siswa_id: string,
                        nama: string,
                    }[] = [];

                    const count = kelompoksiswa.length;
                    for (let i = 0; i < count; i++) {

                        const anggota = {
                            siswa_id: kelompoksiswa[i].id,
                            nama: kelompoksiswa[i].nama,
                        };

                        anggotaArray.push(anggota);
                    }

                    const response = {
                        status: 200,
                        message: "Success",
                        data: {
                            kelompok_id: datakelompok?.id,
                            kelompok: datakelompok?.nama_kelompok,
                            tipe: datakelompok?.program.tipe + " " + datakelompok?.program.level,
                            kelas: datakelompok?.program.kelas.nama_kelas,
                            anggota: anggotaArray,
                    }
                }
                return res.status(200).json(response);
            } catch (error) {
                console.error(error);
                const response = {
                    status: 500,
                    message: "Error loading kelompok",
                    data: {},
                };
                return res.status(500).json(response);
            }
        }
    } catch (error) {
        console.error(error);
        const response = {
            status: 500,
            message: "Error loading siswa",
            data: {},
        };
        return res.status(500).json(response);
    }
}
}