import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const moduls = await prisma.module.findMany({
                include: {
                    mapel: true,
                },
            });
            res.status(200).json(moduls);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading moduls." });
        }
    }
    else if (req.method === "POST") {
        const { nama_module, url, thumbnail, mapel_id } = req.body;

        try {
            const module = await prisma.module.create({
                data: {
                    nama_module,
                    url,
                    thumbnail,
                    mapel_id,
                    
                },
            });
            res.status(201).json(module);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating module." });
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed." });
    }
}
