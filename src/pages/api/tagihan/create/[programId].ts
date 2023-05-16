import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let programId = req.query.programId;

    if (Array.isArray(programId)) {
        programId = programId[0];
    }

    if (req.method === "POST") {
        try {
            const kelompok = await prisma.kelompok.findMany({
                where: {
                    program_id: programId,
                },
            });
            if (kelompok.length > 0) {
                const count = kelompok.length;

                for (let i = 0; i < count; i++) {
                    const siswa = await prisma.siswa.findMany({
                        where: {
                            kelompok_id: kelompok[i].id,
                        },
                    });
                    if (siswa.length > 0) {
                        const count = siswa.length;

                        for (let i = 0; i < count; i++) {
                            const tagihan = await prisma.tagihan.create({
                                data: {
                                    siswa_id: siswa[i].id,
                                    tanggal_tagihan: req.body.tanggal_tagihan,
                                    tanggal_jatuh_tempo: req.body.tanggal_jatuh_tempo,
                                    Bulan: req.body.Bulan,
                                    Tahun: req.body.Tahun,
                                    jumlah_tagihan: req.body.jumlah_tagihan,
                                    status: req.body.status,

                                },
                            });
                        }
                    }
                }
            }
            res.status(200).json({ message: "Tagihan berhasil dibuat." });

        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating tagihan.", error });
        }
    }
}
