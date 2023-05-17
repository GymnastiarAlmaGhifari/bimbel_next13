import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import { format } from "date-fns";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let sesiId = req.query.sesiId;

  let nama_sesi = req.body.nama_sesi;
  let jam_mulai = req.body.jam_mulai;
  let jam_selesai = req.body.jam_selesai;

  const dateNow = new Date();
  const jakartaTimezone = "Asia/Jakarta";
  const dateISOString = format(dateNow, "yyyy-MM-dd");

  const jam_mulai_baru = `${dateISOString}T${jam_mulai}Z`;
  const jam_selesai_baru = `${dateISOString}T${jam_selesai}Z`;

  if (Array.isArray(sesiId)) {
    sesiId = sesiId[0];
  }

  if (req.method === "GET") {
    try {
      const sesi = await prisma.sesi.findUnique({
        where: { id: sesiId },
      });

      if (!sesi) {
        return res.status(404).json({ message: "Sesi not found" });
      }

      res.status(200).json(sesi);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading sesi" });
    }
  } else if (req.method === "PUT") {
    try {
      const sesi = await prisma.sesi.update({
        where: { id: sesiId },
        data: {
          nama_sesi,
          jam_mulai: new Date(jam_mulai_baru),
          jam_selesai: new Date(jam_selesai_baru),
        },
      });

      res.status(200).json(sesi);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating sesi" });
    }
  }
}
