import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let ruang = req.query.ruang_id;

  if (Array.isArray(ruang)) {
    ruang = ruang[0];
  }

  if (req.method === "GET") {
    try {
      const sabtu = await prisma.jadwal_detail.findMany({
        where: {
          hari: "SABTU",
          ruang_id: ruang,
        },
        include: {
          sesi: true,
          mapel: true,
          user: true,
        },
      });

      const sabtuWithKelompok = await Promise.all(
        sabtu.map(async (item) => {
          const kelompok = await prisma.kelompok.findUnique({
            where: {
              jadwal_id: item.jadwal_id,
            },
          });

          console.log(kelompok);
          return {
            ...item,
            kelompok: kelompok,
          };
        })
      );

      res.status(200).json(sabtuWithKelompok);
    } catch (error) {
      res.status(400).json({ message: "Data gagal ditemukan", error });
    }
  }
}
