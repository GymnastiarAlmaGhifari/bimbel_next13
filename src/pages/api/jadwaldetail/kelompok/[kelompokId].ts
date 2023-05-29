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
            include: {
            program: true,
            },
        });

        return res.status(200).json(kelompok);

        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading kelompok" });
        }
    } 
}