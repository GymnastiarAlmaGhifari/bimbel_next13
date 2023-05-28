import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const gajiId = req.query.gajiId as string;
    
    if (req.method === "DELETE") {
        try {
            const gaji = await prisma.gaji.delete({
                where: {
                    id: gajiId,
                },
            });

            res.status(200).json(gaji);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting gaji" });
        }
    }
}