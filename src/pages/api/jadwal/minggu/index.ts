import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let ruang = req.query.ruang_id;

  if (Array.isArray(ruang)) {
    ruang = ruang[0];
  }

  if (req.method === "GET") {
    try {
      const minggu = await prisma.jadwal_detail.findMany({
        where: {
          hari: "MINGGU",
          ruang_id: ruang,
        },
        include: {
          sesi: true,
          mapel: true,
          user: true,
        },
      });

      const mingguWithKelompok = await Promise.all(
        minggu.map(async (item) => {
          const kelompok = await prisma.kelompok.findUnique({
            where: {
              jadwal_id: item.jadwal_id || undefined,
            },
          });

          return {
            ...item,
            kelompok: kelompok,
          };
        })
      );

      if (mingguWithKelompok.length === 0) {
        res.status(404).json({ message: "Data tidak ditemukan" });
      } else {
        res.status(200).json(mingguWithKelompok);
      }
    } catch (error) {
      res.status(400).json({ message: "Data gagal ditemukan", error });
    }
  }
}
