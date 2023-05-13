import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const mapels = await prisma.mapel.findMany({
        include: {
          kelas: true,
        },
      });
      
      res.status(200).json(mapels);
      // res.status(200).json(mapels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading mapels." });
    }
  } else if (req.method === "POST") {
    const { nama_mapel, kelas_id } = req.body;

    try {
      const mapel = await prisma.mapel.create({
        data: {
          nama_mapel,
          kelas_id,
        },
      });
      res.status(201).json(mapel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating mapel." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
