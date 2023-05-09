import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const sesis = await prisma.sesi.findMany();
            res.status(200).json(sesis);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading sesis." });
        }
    } else if (req.method === "POST") {
        const { nama_sesi, jam_mulai, jam_selesai } = req.body;

        try {
            const sesi = await prisma.sesi.create({
                data: {
                    nama_sesi,
                    jam_mulai,
                    jam_selesai
                },
            });
            res.status(201).json(sesi);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating sesi." });
        }
    } else {
        res.status(405).json({ message: "Method not allowed." });
    }   
}