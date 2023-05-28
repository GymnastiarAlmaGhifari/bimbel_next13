import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        
        if (req.method === "GET") {
            try {
                const diskon = await prisma.diskon.findMany({
                    orderBy: {
                        id: "desc",
                    },
                });
    
                res.status(200).json(diskon);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error loading diskon" });
            }
        } else if (req.method === "POST") {
            try {
                const diskon = await prisma.diskon.create({
                    data: {
                        nama_diskon: req.body.nama_diskon,
                    },
                });
    
                res.status(200).json(diskon);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error creating diskon" });
            }
        }
}