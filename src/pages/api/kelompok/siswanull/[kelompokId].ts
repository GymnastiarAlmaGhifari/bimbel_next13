import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let kelompokId = req.query.kelompokId;

    if (Array.isArray(kelompokId)) {
        kelompokId = kelompokId[0];
    }

    const siswaId = req.body.siswaId;

if (req.method === "GET") {
        try {
            const anggota = await prisma.siswa.findMany({
                where: { kelompok_id: kelompokId },
            });

            res.status(200).json(anggota);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading anggota" });
        }
    }
}