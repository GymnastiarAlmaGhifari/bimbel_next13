import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let setgajiId = req.query.setgajiId;

    if (Array.isArray(setgajiId)) {
        setgajiId = setgajiId[0];
    }

    if (req.method === "GET") {
        try {
            const setgaji = await prisma.setgaji.findMany();

            if (!setgaji) {
                return res.status(404).json({ message: "Setgaji not found" });
            }

            res.status(200).json(setgaji);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading setgaji" });
        }
    }

    else if (req.method === "POST") {
        try {
            const setgaji = await prisma.setgaji.create({
                data: { ...req.body },
            });

            res.status(200).json(setgaji);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating setgaji" });
        }
    }
}