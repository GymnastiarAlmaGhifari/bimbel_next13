import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
        const kelas = await prisma.kelas.findMany();
        res.status(200).json(kelas);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading kelas." });
        }
    } else if (req.method === "POST") {
        const { nama_kelas } = req.body;
    
        try {
        const kelas = await prisma.kelas.create({
            data: {
            nama_kelas,
            },
        });
        res.status(201).json(kelas);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating kelas." });
        }
    } else {
        res.status(405).json({ message: "Method not allowed." });
    }
    }