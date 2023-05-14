import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let mapelId = req.query.mapelId;

    if (Array.isArray(mapelId)) {
        mapelId = mapelId[0];
    }

    if (req.method === "GET") {
        try {
            const mapel = await prisma.mapel.findUnique({
                where: { id: mapelId },
            });

            if (!mapel) {
                return res.status(404).json({ message: "Mapel not found" });
            }

            res.status(200).json(mapel);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading mapel" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const mapel = await prisma.mapel.update({
                where: { id: mapelId },
                data: { ...req.body },
            });

            res.status(200).json(mapel);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating mapel" });
        }
    }
}