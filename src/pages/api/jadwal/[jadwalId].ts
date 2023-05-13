import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let jadwalId = req.query.jadwalId;

    if (Array.isArray(jadwalId)) {
        jadwalId = jadwalId[0];
    }

    if (req.method === "GET") {
        try {
            const jadwal = await prisma.jadwal.findUnique({
                where: { id: jadwalId },
            });

            if (!jadwal) {
                return res.status(404).json({ message: "Jadwal not found" });
            }

            res.status(200).json(jadwal);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading jadwal" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const jadwal = await prisma.jadwal.update({
                where: { id: jadwalId },
                data: { ...req.body },
            });

            res.status(200).json(jadwal);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating jadwal" });
        }
    }
}