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
      const jumat = await prisma.jadwal_detail.findMany({
        where: {
            hari: {
                in: [hari as Hari],
            },
          ruang_id: ruang,
        },
        include: {
          sesi: true,
          mapel: true,
          user: true,
        },
      });

      console.log(jumat);
      
      const jumatWithKelompok = await Promise.all(
        jumat.map(async (item) => {
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

      if (jumatWithKelompok.length === 0) {
        res.status(404).json({ message: "Data tidak ditemukan" });
      } else {
        res.status(200).json(jumatWithKelompok);
      }
    } catch (error) {
      res.status(404).json({ message: "Data gagal ditemukan", error });
    }
  }
}
