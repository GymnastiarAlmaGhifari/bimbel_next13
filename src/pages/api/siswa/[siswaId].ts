import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let siswaId = req.query.siswaId;

  if (Array.isArray(siswaId)) {
    siswaId = siswaId[0];
  }

  if (req.method === "PUT") {
    try {
      const siswa = await prisma.siswa.update({
        where: { id: siswaId },
        data: { ...req.body },
      });

      res.status(200).json(siswa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating siswa" });
    }
  } else if (req.method === "DELETE") {
    try {
      const siswa = await prisma.siswa.findUnique({
        where: { id: siswaId },
      });

      if (siswa) {
        await prisma.siswa.delete({
          where: { id: siswaId },
        });

        //delete image from upload/img/siswa
        const fs = require("fs");
        const path = require("path");
        const filePath = path.join(process.cwd(), "public", "img", "siswa", siswa.image);
        fs.unlinkSync(filePath);

        res.status(200).json(siswa);
      } else {
        return res.status(404).json({ message: "siswa not found" });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting siswa" });
    }
  } else if (req.method === "GET") {
    try {
      const siswa = await prisma.siswa.findUnique({
        where: { id: siswaId },
      });

      res.status(200).json(siswa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading siswa" });
    }
  }
}
