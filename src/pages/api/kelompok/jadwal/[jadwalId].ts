import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let jadwalId = req.query.jadwalId;

  if (Array.isArray(jadwalId)) {
    jadwalId = jadwalId[0];
  }

  console.log("jadwalId ", jadwalId);

  if (req.method === "GET") {
    try {
      const detailjadwal = await prisma.jadwal_detail.findMany({
        where: { jadwal_id: jadwalId },
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
          jam_mulai: moment(detailjadwal.sesi.jam_mulai).tz("UTC").format("HH:mm:ss"),
          jam_selesai: moment(detailjadwal.sesi.jam_selesai).tz("UTC").format("HH:mm:ss"),
        },
      }));

      res.status(200).json(detailjadwalformat);
      console.log("detailjadwal ", detailjadwal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading detailjadwal" });
    }
  }
}
