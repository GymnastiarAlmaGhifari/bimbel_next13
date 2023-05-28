import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import { format } from "date-fns";
import { Bulan } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let programId = req.query.programId;

    if (Array.isArray(programId)) {
        programId = programId[0];
    }

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const day = now.getDay();

    const dayname = [
        "MINGGU",
        "SENIN",
        "SELASA",
        "RABU",
        "KAMIS",
        "JUMAT",
        "SABTU",
    ];

    const hari = dayname[day];

    const monthNames = [
        "JANUARI",
        "FEBRUARI",
        "MARET",
        "APRIL",
        "MEI",
        "JUNI",
        "JULI",
        "AGUSTUS",
        "SEPTEMBER",
        "OKTOBER",
        "NOVEMBER",
        "DESEMBER",
    ];

    const currentMonthName = monthNames[month];

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
                                    tanggal_tagihan: format(new Date(Date.now()), 'dd-MM-yyyy'),
                                    tanggal_jatuh_tempo: req.body.tanggal_jatuh_tempo,
                                    Bulan: currentMonthName as Bulan,
                                    Tahun: year,
                                    jumlah_tagihan: req.body.jumlah_tagihan,
                                    status: "BELUM_BAYAR",

                                },
                            });
                            console.log(tagihan);
                        }
                    }
                }
            }
            res.status(200).json({ message: "Tagihan berhasil dibuat.", });

        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating tagihan.", error });
        }
    }
}
