import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import { Hari } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let ruang = req.query.ruang_id;
  let hari = req.query.hari;

  if (Array.isArray(ruang)) {
    ruang = ruang[0];
  }

    if (Array.isArray(hari)) {
    hari = hari[0];
    }

  if (req.method === "GET") {
    try {
      const haris = await prisma.jadwal_detail.findMany({
        where: {
            hari: {
                in: [hari as Hari],
            },
          ruang_id: ruang,
        },
        include: {
          kelompok: true,
          sesi: true,
          mapel: true,
          user: true,
        },
      });

      if (haris.length === 0) {
        res.status(404).json({ message: "Data tidak ditemukan" });
      } else {
        res.status(200).json(haris);
      }
    } catch (error) {
      res.status(404).json({ message: "Data gagal ditemukan", error });
    }
  }
}
