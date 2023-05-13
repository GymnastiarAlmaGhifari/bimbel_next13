import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let kelompokId = req.query.kelompokId;

    if (Array.isArray(kelompokId)) {
        kelompokId = kelompokId[0];
    }

    if (req.method === "GET") {
        try {
            const kelompok = await prisma.kelompok.findUnique({
                where: { id: kelompokId },
            });

            if (!kelompok) {
                return res.status(404).json({ message: "Kelompok not found" });
            }

            res.status(200).json(kelompok);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading kelompok" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const kelompok = await prisma.kelompok.update({
                where: { id: kelompokId },
                data: { ...req.body },
            });

            res.status(200).json(kelompok);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating kelompok" });
        }
    }
}