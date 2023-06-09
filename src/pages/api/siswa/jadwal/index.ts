import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import jwt, { JwtPayload } from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let token = req.headers.authorization;
    if (Array.isArray(token)) {
        token = token[0];
    }
    if (req.method === "GET") {
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT secret not defined in environment variables');
            }
            if (!token) {
                throw new Error('Token not found');
            }

            // Verify the token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

            // Check if the token is expired
            const tokenExpirationDate = new Date(decodedToken.exp! * 1000);
            const currentDateTime = new Date();
            // if (currentDateTime > tokenExpirationDate) {
            //     const response = {
            //         status: 401,
            //         message: "Token expired",
            //     };
            //     return res.status(401).json(response);
            // }

            const siswakelompok = await prisma.siswa.findUnique({
                where: {
                    token: token,
                },
            });

            try {
                const jadwal = await prisma.jadwal_detail.findMany({
                    where: {
                        kelompok_id: siswakelompok?.kelompok_id,
                    },
                    include: {
                        sesi: true,
                        mapel: true,
                        ruang: true,
                        user: true,
                    },
                });

                if (!jadwal) {
                    return res.status(404).json({
                        status: 404,
                        message: "Jadwal tidak ditemukan",
                        data: {},
                    });
                } else {
                    const scheduleArray: {
                        jadwal_id: string;
                        mapel: string | undefined;
                        hari: string | undefined;
                        ruang: string | undefined;
                        tentor: string | null | undefined;
                        sesi: string | undefined;
                        jam: string;
                        mulai: Date | undefined;
                        selesai: Date | undefined;
                    }[] = [];

                    const count = jadwal.length;
                    for (let i = 0; i < count; i++) {

                        const mulai = jadwal[i].sesi?.jam_mulai as Date;
                        const formattedmulai = new Date(mulai).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });

                        const selesai = jadwal[i].sesi?.jam_selesai as Date;
                        const formattedselesai = new Date(selesai).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });

                        const time_mulai = jadwal[i].sesi?.jam_mulai as Date;
                        const formattedtime_mulai = new Date(time_mulai).getTime();

                        const time_selesai = jadwal[i].sesi?.jam_selesai as Date;
                        const formattedtime_selesai = new Date(time_selesai).getTime();

                        const schedule = {
                            jadwal_id: jadwal[i].id,
                            mapel: jadwal[i].mapel?.nama_mapel,
                            hari: jadwal[i].hari,
                            ruang: jadwal[i].ruang?.nama_ruang,
                            tentor: jadwal[i].user?.name,
                            sesi: jadwal[i].sesi?.nama_sesi,
                            jam: formattedmulai + " - " + formattedselesai,
                            mulai: jadwal[i].sesi?.jam_mulai,
                            selesai: jadwal[i].sesi?.jam_selesai,
                        };

                        scheduleArray.push(schedule);
                    }

                    const response = {
                        status: 200,
                        message: "Jadwal ditemukan",
                        data: scheduleArray,
                    };
                    res.status(200).json(response);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    status: 500,
                    message: "Error memuat jadwal",
                    data: {},
                });
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                const response = {
                    status: 401,
                    message: "Token kedaluwarsa",
                    data: {},
                };
                return res.status(401).json(response);
            }
            console.error(error);
            res.status(500).json({
                status: 500,
                message: "Error memuat jadwal",
                data: {},
            });
        }
    }
}