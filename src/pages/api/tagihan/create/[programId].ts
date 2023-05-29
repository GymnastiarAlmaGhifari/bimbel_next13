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

  const dayname = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];

  const hari = dayname[day];

  const monthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

  const currentMonthName = monthNames[month];

  if (req.method === "POST") {
    try {
      const kelompok = await prisma.kelompok.findMany({
        where: {
          program_id: programId,
        },
      });

      if (!kelompok) {
        return res.status(404).json({ message: "Kelompok not found." });
      }
      const program = await prisma.program.findUnique({
        where: {
          id: programId,
        },
      });

      const rek = await prisma.rekening.findFirst({});

      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 20);

      let formattedDate = currentDate.toISOString();
      console.log(formattedDate);

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
                  tanggal_tagihan: new Date(),
                  tanggal_jatuh_tempo: new Date(formattedDate),
                  Bulan: currentMonthName as Bulan,
                  Tahun: year,
                  jumlah_tagihan: program?.harga || 0,
                  status: "BELUM_BAYAR",
                  nama_rekening: rek?.nama_rekening,
                  nomor_rekening: rek?.nomor_rekening,
                },
              });
              console.log(tagihan);
            }
          }
        }
      }
      res.status(200).json({ message: "Tagihan berhasil dibuat." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating tagihan.", error });
    }
  }
}
