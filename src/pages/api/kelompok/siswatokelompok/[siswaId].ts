import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let siswaId = req.query.siswaId;

    if (Array.isArray(siswaId)) {
        siswaId = siswaId[0];
      }

    if (req.method === "PUT") {
        try {
            const {kelompok_id} = req.body;
                const siswa = await prisma.siswa.update({
                  where: { id: siswaId },
                    data: { kelompok_id: kelompok_id },
                });
                res.status(200).json(siswa);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating siswa" });
        }
    }
}