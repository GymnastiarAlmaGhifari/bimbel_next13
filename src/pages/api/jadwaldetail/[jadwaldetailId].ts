import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let jadwaldetailId = req.query.jadwaldetailId;

    if (Array.isArray(jadwaldetailId)) {
        jadwaldetailId = jadwaldetailId[0];
    }

    if (req.method === "GET") {
        try {
            const jadwaldetail = await prisma.jadwal_detail.findUnique({
                where: { id: jadwaldetailId },
            });

            if (!jadwaldetail) {
                return res.status(404).json({ message: "Detail jadwal not found" });
            }

            res.status(200).json(jadwaldetail);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading detail jadwal" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const jadwaldetail = await prisma.jadwal_detail.update({
                where: { id: jadwaldetailId },
                data: { ...req.body },
            });

            res.status(200).json(jadwaldetail);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating detail jadwal" });
        }
    }
}