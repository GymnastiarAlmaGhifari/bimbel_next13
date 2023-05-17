import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import moment from "moment";
import "moment-timezone";
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
  if (req.method === "GET") {
    try {
      const sesis = await prisma.sesi.findMany();

      const sesisFormatted = sesis.map((sesi) => ({
        ...sesi,
        jam_mulai: moment(sesi.jam_mulai).tz("UTC").format("HH:mm:ss"),
        jam_selesai: moment(sesi.jam_selesai).tz("UTC").format("HH:mm:ss"),
      }));

      res.status(200).json(sesisFormatted);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading sesis." });
    }
  } else if (req.method === "POST") {
    const { nama_sesi } = req.body;

    try {
      const sesi = await prisma.sesi.create({
        data: {
          nama_sesi,
          jam_mulai: new Date(jam_mulai_baru),
          jam_selesai: new Date(jam_selesai_baru),
        },
      });
      res.status(201).json(sesi);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating sesi." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
