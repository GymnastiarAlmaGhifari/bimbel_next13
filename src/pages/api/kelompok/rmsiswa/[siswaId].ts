import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const siswaId = req.query.siswaId as string;

    if (req.method === "DELETE") {
        try {
            const siswa = await prisma.siswa.update({
                where: { id: siswaId },
                data: {
                    kelompok: {
                        disconnect: true,
                    }
                },
            });

            res.status(200).json(siswa);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting siswa" });
        }
    }
}