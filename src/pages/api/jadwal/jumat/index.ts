import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let ruang = req.query.ruang_id;

  if (Array.isArray(ruang)) {
    ruang = ruang[0];
  }

  if (req.method === "GET") {
    try {
      const jumat = await prisma.jadwal_detail.findMany({
        where: {
          hari: "JUMAT",
          ruang_id: ruang,
        },
        include: {
          sesi: true,
          mapel: true,
          user: true,
        },
      });

      const jumatWithKelompok = await Promise.all(
        jumat.map(async (item) => {
          const kelompok = await prisma.kelompok.findUnique({
            where: {
              jadwal_id: item.jadwal_id,
            },
          });

          return {
            ...item,
            kelompok: kelompok,
          };
        })
      );

      res.status(200).json(jumatWithKelompok);
    } catch (error) {
      res.status(400).json({ message: "Data gagal ditemukan", error });
    }
  }
}
