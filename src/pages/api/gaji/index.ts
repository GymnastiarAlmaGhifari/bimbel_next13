import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === "GET") {
        try {
            const gaji = await prisma.gaji.findMany({
                orderBy: {
                    id: "desc",
                },
                include: {
                    user: true,
                },
            });

            res.status(200).json(gaji);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading gaji" });
        }
    } else if (req.method === "POST") {
        try {
            const gaji = await prisma.gaji.create({
                data: {
                    ...req.body,
                },
            });

            res.status(200).json(gaji);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating gaji" });
        }
    }
}