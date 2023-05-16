import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let token = req.headers.authorization;
    if (Array.isArray(token)) {
        token = token[0];
    }
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
                return res.status(404).json({ message: "Siswa belum punya kelompok" });
            } else {
                const kelompok = siswakelompok.kelompok;
                if (!kelompok) {
                    return res.status(404).json({ message: "Kelompok tidak ditemukan" });
                }
                try {
                    const jadwal = await prisma.jadwal_detail.findMany({
                        where: {
                            jadwal_id: {
                                equals: kelompok.jadwal_id || undefined,
                            },
                        },
                        include: {
                            sesi: true,
                            mapel: true,
                            ruang: true,
                            user: true,
                        },
                    });


                    const scheduleArray: {
                        jadwal_id: string;
                        mapel: string | undefined;
                        ruang: string | undefined;
                        tentor: string | null | undefined;
                        sesi: string | undefined;
                        jam: string;
                    }[] = [];

                    const count = jadwal.length;
                    for (let i = 0; i < count; i++) {
                        
                        const mulai = jadwal[i].sesi?.jam_mulai as Date;
                        const formattedmulai = new Date(mulai).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "UTC" });

                        const selesai = jadwal[i].sesi?.jam_selesai as Date;
                        const formattedselesai = new Date(selesai).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "UTC" });

                        const schedule = {
                            jadwal_id: jadwal[i].jadwal_id,
                            mapel: jadwal[i].mapel?.nama_mapel,
                            ruang: jadwal[i].ruang?.nama,
                            tentor: jadwal[i].user?.name,
                            sesi: jadwal[i].sesi?.nama_sesi,
                            jam: formattedmulai + " - " + formattedselesai,
                        };

                        scheduleArray.push(schedule);
                    }

                    const response = {
                        status: 200,
                        message: "Login success",
                        data: scheduleArray,
                    };
                    res.status(200).json(response);
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: "Error loading jadwal" });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading jadwal" });
        }
    }
}