import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ruang = req.headers.from;

    if (req.method === "GET") {
        try {
            const selasa = await prisma.jadwal_detail.findMany({
                where: {
                    hari: "SELASA",
                    ruang_id: ruang,
                },
                include: {
                    sesi: true,
                    mapel: true,
                    user: true
                },

            });
            res.status(200).json(selasa);
        } catch (error) {
            res.status(400).json({ message: "Data gagal ditemukan", error });
        }
    }
}