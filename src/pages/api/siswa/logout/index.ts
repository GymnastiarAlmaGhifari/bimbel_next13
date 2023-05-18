import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization;

    if (req.method === "GET") {
        try {
            const siswas = await prisma.siswa.findUnique({
                where: {
                    token: token,
                },
            });
            if (!siswas) {
                return res.status(404).json({ 
                    status: 404,
                    message: "Pengguna tidak ditemukan",
                    data: {},
                 });
            }

            const deltoken = await prisma.siswa.update({
                where: {
                    id: siswas.id,
                },
                data: {
                    token: null,
                },
            });

            res.status(200).json({
                status: 200,
                message: "Berhasil logout",
                data: {},
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error logout.", error });
            
        }
    }
}