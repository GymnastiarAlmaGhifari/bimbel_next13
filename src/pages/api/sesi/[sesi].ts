import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let sesiId = req.query.sesiId;

    if (Array.isArray(sesiId)) {
        sesiId = sesiId[0];
    }

    if (req.method === "GET") {
        try {
            const sesi = await prisma.sesi.findUnique({
                where: { id: sesiId },
            });

            if (!sesi) {
                return res.status(404).json({ message: "Sesi not found" });
            }

            res.status(200).json(sesi);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading sesi" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const sesi = await prisma.sesi.update({
                where: { id: sesiId },
                data: { ...req.body },
            });

            res.status(200).json(sesi);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating sesi" });
        }
    }
}