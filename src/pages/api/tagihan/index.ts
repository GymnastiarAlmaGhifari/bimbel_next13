import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let Bulan = req.body.Bulan;
    let Tahun = req.body.Tahun;

    if (req.method === "GET") {
        try {
            const tagihan = await prisma.tagihan.findMany({
                where: {
                    Bulan: Bulan,
                    Tahun: Tahun,
                },
                include: {
                    user: true,
                },
            });
            res.status(200).json(tagihan);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading tagihan." });
        }
    }
    else if (req.method === "POST") {
        try {
            const tagihan = await prisma.tagihan.findMany({
                where: {
                    siswa_id: req.body.siswa_id,
                    Bulan: Bulan,
                    Tahun: Tahun,
                },
                include: {
                    user: true,
                },
            });

            //if tagihan not null
            if (tagihan.length > 0) {
                res.status(200).json({ message: "Tagihan sudah ada." });
            } else {
                try {
                    const tagihan = await prisma.tagihan.create({
                        data: { ...req.body },
                    });
                    res.status(200).json(tagihan);
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: "Error creating tagihan.", error });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading tagihan." });
        }
    }
}
