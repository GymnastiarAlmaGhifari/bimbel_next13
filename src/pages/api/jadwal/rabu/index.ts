import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ruang = req.headers.from;

    if (req.method === "GET") {
        try {
            const rabu = await prisma.jadwal_detail.findMany({
                where: {
                    hari: "RABU",
                    ruang_id: ruang,
                },
                include: {
                    sesi: true,
                    mapel: true,
                    user: true
                },

            });
            res.status(200).json(rabu);
        } catch (error) {
            res.status(400).json({ message: "Data gagal ditemukan", error });
        }
    }
}