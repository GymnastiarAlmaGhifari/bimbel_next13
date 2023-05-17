import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let kelasId = req.query.kelasId;

  if (Array.isArray(kelasId)) {
    kelasId = kelasId[0];
  }

  if (req.method === "GET") {
    try {
      const kelas = await prisma.kelas.findUnique({
        where: { id: kelasId },
      });

      if (!kelas) {
        return res.status(404).json({ message: "Kelas not found" });
      }

      res.status(200).json(kelas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading kelas" });
    }
  } else if (req.method === "PUT") {
    try {
      const kelas = await prisma.kelas.update({
        where: { id: kelasId },
        data: { ...req.body },
      });

      res.status(200).json(kelas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating kelas" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedKelas = await prisma.kelas.delete({
        where: { id: kelasId },
      });

      res.status(200).json(deletedKelas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting kelas" });
    }
  }
}
