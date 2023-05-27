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

            try {
                const support = await prisma.user.findMany({
                    where: {
                        role: "ADMIN" || "SUPER",
                        nomor_telepon: {
                            not: null,
                        },
                    },

                });
                const random = Math.floor(Math.random() * support.length);
                const data = support[random];

                const response = {
                    status: 200,
                    message: "Berhasil memuat data support",
                    data: {
                        id: data.id,
                        nama: data.name,
                        nomor_telepon: data.nomor_telepon,
                    },
                };
                return res.status(200).json(response);

            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error memuat Support" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error memuat data siswa" });
        }
    }
}