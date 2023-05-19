import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ruang = req.query.ruang_id;

  if (req.method === "GET") {
    try {
      const kamis = await prisma.jadwal_detail.findMany({
        where: {
          hari: "KAMIS",
          ruang_id: ruang,
        },
        include: {
          sesi: true,
          mapel: true,
          user: true,
        },
      });
      res.status(200).json(kamis);
    } catch (error) {
      res.status(400).json({ message: "Data gagal ditemukan", error });
    }
  }
}
