import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let tagihanId = req.query.tagihanId;
    const token = req.headers.authorization;

    if (Array.isArray(tagihanId)) {
        tagihanId = tagihanId[0];
    }

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

            const tagihan = await prisma.tagihan.findUnique({
                where: {
                    id: tagihanId,
                },
            });

            if (!tagihan) {
                return res.status(404).json({
                    status: 404,
                    message: "Tagihan tidak ditemukan",
                    data: {},
                });
            }
            const response = {
                status: 200,
                message: "Berhasil mendapatkan tagihan",
                data: {
                    id: tagihan?.id,
                    bulan: tagihan?.Bulan,
                    tahun: tagihan?.Tahun,
                    jumlah: tagihan?.jumlah_tagihan,
                    status: tagihan.status,
                    nama_rekening: tagihan?.nama_rekening,
                    nomor_rekening: tagihan?.nomor_rekening,
                    tanggal_bayar: tagihan.tanggal_bayar,
                    jatuh_tempo: tagihan.tanggal_jatuh_tempo,
                    tanggal_approve: tagihan.tanggal_approve,
                },
            };

            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan pada server",
                data: {},
            });
        }
    }
}
