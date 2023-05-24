import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let rekeningId = req.query.rekeningId;

    if (Array.isArray(rekeningId)) {
        rekeningId = rekeningId[0];
    }

    if (req.method === "GET") {
        try {
            const rekening = await prisma.rekening.findUnique({
                where: { id: rekeningId },
            });

            if (!rekening) {
                return res.status(404).json({ message: "Rekening not found" });
            }

            res.status(200).json(rekening);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading rekening" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const rekening = await prisma.rekening.update({
                where: { id: rekeningId },
                data: { ...req.body },
            });

            res.status(200).json(rekening);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating rekening" });
        }
    }
}