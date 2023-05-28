import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query.diskonId as string;

    if (req.method === "GET") {
        try {
            const diskon = await prisma.diskon.findUnique({
                where: {
                    id: id,
                },
            });

            res.status(200).json(diskon);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading diskon" });
        }
    } else if (req.method === "POST") {
        try {
            const diskon = await prisma.diskon.update({
                where: {
                    id: id,
                },
                data: {
                    nama_diskon: req.body.nama_diskon,
                },
            });

            res.status(200).json(diskon);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating diskon" });
        }
    } else if (req.method === "DELETE") {
        try {
            const diskon = await prisma.diskon.delete({
                where: {
                    id: id,
                },
            });

            res.status(200).json(diskon);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting diskon" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
