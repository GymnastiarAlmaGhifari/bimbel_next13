import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { nama_program, tipe, level, harga, kelas_id, Deskripsi } = req.body;
    try {
      const result = await prisma.program.create({
        data: {
          nama_program,
          tipe,
          level,
          kelas_id,
          harga,
          Deskripsi,
        },
      });

      const update = await prisma.program.update({
        where: { id: result.id },
        data: {
          img: result.id + ".jpg",
        },
      });
      res.status(201).json(update);
    } catch (error) {
      res.status(400).json({ message: "Data gagal disimpan", error });
    }
  } else if (req.method === "GET") {
    try {
      const result = await prisma.program.findMany({
        include: {
          kelas: true,
        },
        orderBy: {
          nama_program: "asc",
        },
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: "Data gagal ditemukan", error });
    }
  }
}
