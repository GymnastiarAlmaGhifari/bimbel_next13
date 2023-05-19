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
                include: {
                    kelompok: true,
                },
            });

            if (!siswas) {
                return res.status(404).json({
                    status: 404,
                    message: "Pengguna tidak ditemukan",
                    data: {},
                });
            } else {
                const tagihan = await prisma.tagihan.findMany({
                    where: {
                        siswa_id: siswas.id,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                if (!tagihan) {
                    return res.status(404).json({
                        status: 404,
                        message: "Siswa tidak memiliki tagihan",
                        data: {},
                    });
                }

                const tagihansArray: {
                    id: string;
                    bulan: string | null;
                    tahun: number | null;
                    jumlah: number;
                    status: string;
                    nama_rekening: string | null;
                    nomor_rekening: string | null;
                    tanggal_bayar: Date | null;
                    jatuh_tempo: Date;
                    tanggal_approve: Date | null;
                }[] = [];

                const count = tagihan.length;
                for (let i = 0; i < count; i++) {

                    const jatuh_tempo = tagihan[i].tanggal_jatuh_tempo as Date;
                    const monthNames = [
                        "Januari",
                        "Februari",
                        "Maret",
                        "April",
                        "Mei",
                        "Juni",
                        "Juli",
                        "Agustus",
                        "September",
                        "Oktober",
                        "November",
                        "Desember"
                      ];
                      
                      const formattedjatuhtempo = `${jatuh_tempo.getDate()} ${monthNames[jatuh_tempo.getMonth()]} ${jatuh_tempo.getFullYear()}`;

                    const tagihans = {
                    id: tagihan[i].id,
                    bulan: tagihan[i].Bulan,
                    tahun: tagihan[i].Tahun,
                    jumlah: tagihan[i].jumlah_tagihan,
                    status: tagihan[i].status,
                    nama_rekening: tagihan[i].nama_rekening,
                    nomor_rekening: tagihan[i].nomor_rekening,
                    tanggal_bayar: tagihan[i].tanggal_bayar,
                    jatuh_tempo: tagihan[i].tanggal_jatuh_tempo,
                    tanggal_approve: tagihan[i].tanggal_approve,
                    };

                    tagihansArray.push(tagihans);
                }

                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mendapatkan tagihan",
                    data: tagihansArray,
                });

            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {},
            });
        }
    } else {
        return res.status(405).json({
            status: 405,
            message: "Method not allowed",
            data: {},
        });
    }
}