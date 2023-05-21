import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === "GET") {
        try {
            const siswas = await prisma.siswa.findMany({
                where: { kelompok_id: null },
            });

            res.status(200).json(siswas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading siswa" });
        }
    }
}