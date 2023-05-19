import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ruang = req.headers.from;

    if (req.method === "GET") {
        try {
            const senin = await prisma.jadwal_detail.findMany({
                where: {
                    hari: "SENIN",
                    ruang_id: ruang,
                },
                include: {
                    sesi: true,
                    mapel: true,
                    user: true
                },
            });


            const seninWithKelompok = await Promise.all(
                senin.map(async (item) => {
                    const kelompok = await prisma.kelompok.findUnique({
                        where: {
                            jadwal_id: item.jadwal_id,
                        },
                    });

                    console.log(kelompok);
                    return {
                        ...item,
                        kelompok: kelompok,
                    };
                })
            );

            res.status(200).json(seninWithKelompok);
        } catch (error) {
            res.status(400).json({ message: "Data gagal ditemukan", error });
        }
    }
}