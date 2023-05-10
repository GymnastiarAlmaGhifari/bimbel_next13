import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

//insert into jadwal (nama) and jadwal_detail (hari, jadwal_id, sesi_id, mapel_id, user_id, ruang_id)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { nama, hari, sesi_id, mapel_id, user_id, ruang_id } = req.body;
    try {
      const result = await prisma.jadwal.create({
        data: {
          nama,
          jadwal_detail: {
            create: {
              hari,
              sesi_id,
              mapel_id,
              user_id,
              ruang_id,
            },
          },
        },
        include: {
          jadwal_detail: true,
        },
      });
      res.status(201).json({ message: "Data berhasil disimpan", data: result });
    } catch (error) {
      res.status(400).json({ message: "Data gagal disimpan", error });
    }
  } else if (req.method === "GET") {
    try {
      const result = await prisma.jadwal.findMany({
        orderBy: {
          nama: "asc",
        },
        include: {
          jadwal_detail: true,
        },
      });
      res.status(200).json({ message: "Data berhasil ditemukan", data: result });
    } catch (error) {
      res.status(400).json({ message: "Data gagal ditemukan", error });
    }
  }
}
