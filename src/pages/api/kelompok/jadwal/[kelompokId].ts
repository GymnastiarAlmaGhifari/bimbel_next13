import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let kelompokId = req.query.kelompokId;

  if (Array.isArray(kelompokId)) {
    kelompokId = kelompokId[0];
  }

  if (req.method === "GET") {
    try {
      const detailjadwal = await prisma.jadwal_detail.findMany({
        where: { kelompok_id: kelompokId },
        include: {
          sesi: true,
          mapel: true,
          user: true,
          ruang: true,
        },
      });

      const detailjadwalformat = detailjadwal.map((detailjadwal: any) => ({
        ...detailjadwal,
        sesi: {
          ...detailjadwal.sesi,
          jam_mulai: new Date(detailjadwal.sesi.jam_mulai).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }),
          jam_selesai: new Date(detailjadwal.sesi.jam_selesai).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }),
        },
      }));

      res.status(200).json(detailjadwalformat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading detailjadwal" });
    }
  }
}
