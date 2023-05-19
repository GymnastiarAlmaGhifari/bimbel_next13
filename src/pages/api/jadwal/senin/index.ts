import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ruang = req.query.ruang_id;
  console.log("kljaskajk", ruang);

  if (req.method === "GET") {
    try {
      const senin = await prisma.jadwal_detail.findMany({
        where: {
          hari: "SENIN",
          ruang_id: ruang,
        },
        include: {
          sesi: true,
          mapel: true,
          user: true,
        },
      });
      res.status(200).json(senin);
    } catch (error) {
      res.status(400).json({ message: "Data gagal ditemukan", error });
    }
  }
}
