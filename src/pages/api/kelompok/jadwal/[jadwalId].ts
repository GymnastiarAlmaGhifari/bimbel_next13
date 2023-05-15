import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let jadwalId = req.query.jadwalId;

    if (Array.isArray(jadwalId)) {
        jadwalId = jadwalId[0];
        }

        console.log("jadwalId ", jadwalId);

    if (req.method === "GET") {
             try {
            const detailjadwal = await prisma.jadwal_detail.findMany({
                where: { jadwal_id: jadwalId},
                include: {
                    sesi: true,
                    mapel: true,
                    user: true,
                    ruang: true,
                },

            });
            res.status(200).json(detailjadwal);
            console.log("detailjadwal ", detailjadwal);
        } catch (
            error
        ) {
            console.error(error);
            res.status(500).json({ message: "Error loading detailjadwal" });
        }
    }
}