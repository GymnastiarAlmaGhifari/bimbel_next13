import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

//input json jadwal id and return jadwal detail
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const kelompokId = req.query.kelompok_id;

    if (req.method === "GET") {
        try {
            const jadwal = await prisma.jadwal_detail.findMany({
                where: { kelompok_id: kelompokId as string },
            });
            if (!jadwal) {
                const response = {
                    status: 404,
                    message: "Jadwal not found",
                };
                return res.status(404).json(response);
            }
            const response = {
                status: 200,
                message: "Jadwal detail",
                data: jadwal,
            };
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            const response = {
                status: 500,
                message: "Internal server error",
            };
            return res.status(500).json(response);
        }
    } else {
        const response = {
            status: 405,
            message: "Method not allowed",
        };
        return res.status(405).json(response);
    }
}