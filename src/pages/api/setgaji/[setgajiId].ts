import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let setgajiId = req.query.setgajiId;

    if (Array.isArray(setgajiId)) {
        setgajiId = setgajiId[0];
    }

    if (req.method === "GET") {
        try {
            const setgaji = await prisma.setgaji.findUnique({
                where: { id: setgajiId },
            });

            if (!setgaji) {
                return res.status(404).json({ message: "Setgaji not found" });
            }

            res.status(200).json(setgaji);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading setgaji" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const setgaji = await prisma.setgaji.update({
                where: { id: setgajiId },
                data: { ...req.body },
            });

            res.status(200).json(setgaji);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating setgaji" });
        }
    } else if (req.method === "DELETE") {
        try {
            const setgaji = await prisma.setgaji.delete({
                where: { id: setgajiId },
            });

            res.status(200).json(setgaji);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting setgaji" });
        }
    }
}