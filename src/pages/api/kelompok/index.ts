import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { nama_kelompok, program_id } = req.body;
    try {
      const result = await prisma.kelompok.create({
        data: {
          nama_kelompok,
          program_id,
        },
      });
      res.status(201).json({ message: "Data berhasil disimpan", data: result });
    } catch (error) {
      res.status(400).json({ message: "Data gagal disimpan", error });
    }
  } else if (req.method === "GET") {
    try {
      const result = await prisma.kelompok.findMany({
        include: {
          program: true,
        },
        orderBy: {
          nama_kelompok: "asc",
        },
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }
}
