import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        try {
            const siswas = await prisma.siswa.findMany({
                where: {
                    kelompok_id: null,
                },
            });
            if (!siswas) {
                return res.status(404).json({
                    status: 404,
                    message: "Semua siswa sudah memiliki kelompok",
                });
            }

            res.status(200).json(siswas);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading siswa" });
        }
    }
}