import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let kelasId = req.query.kelasId;

    if (Array.isArray(kelasId)) {
        kelasId = kelasId[0];
    }
    
    if (req.method === "GET") {
        try {
            const mapel = await prisma.mapel.findMany({
                where: { kelas_id: kelasId },
            });

            if (!mapel) {
                return res.status(404).json({ message: "Mapel not found" });
            }

            res.status(200).json(mapel);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading mapel" });
        }
    }
}