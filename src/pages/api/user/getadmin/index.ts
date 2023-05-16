import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ["ADMIN", "TENTOR"],
            },
        },
            include: {
            mapel: true,
            },
        });
        res.status(200).json(users);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading users." });
        }
    } 
    }   