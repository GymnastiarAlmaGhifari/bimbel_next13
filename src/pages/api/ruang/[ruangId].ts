import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let ruangId = req.query.ruangId;

    if (Array.isArray(ruangId)) {
        ruangId = ruangId[0];
    }

    if (req.method === "GET") {
        try {
            const ruang = await prisma.ruang.findUnique({
                where: { id: ruangId },
            });

            if (!ruang) {
                return res.status(404).json({ message: "Ruang not found" });
            }

            res.status(200).json(ruang);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading ruang" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const ruang = await prisma.ruang.update({
                where: { id: ruangId },
                data: { ...req.body },
            });

            res.status(200).json(ruang);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating ruang" });
        }
    }
}