import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import Siswa from "@/pages/siswa";
import { el } from "date-fns/locale";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let id = req.query.modulId;

  if (Array.isArray(id)) {
    id = id[0];
  }

  if (req.method === "PUT") {
    try {
      const result = await prisma.module.update({
        where: { id },
        data: { ...req.body },
      });

      res.status(200).json({ message: "Data berhasil diupdate", data: result });
    } catch (error) {
      res.status(400).json({ message: "Data gagal diupdate", error });
    }
  } else if (req.method === "DELETE") {
    try {
      const modul = await prisma.module.findUnique({
        where: { id },
      });

      if (modul) {
      const deletedModul = await prisma.module.delete({
        where: { id },
      });

      //delete pdf modul
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(process.cwd(), "upload", "modul", modul.url);
      fs.unlinkSync(filePath);

      //delete image modul 
      const filePathImage = path.join(process.cwd(), "upload", "modul", "thumb", modul.thumbnail);
      fs.unlinkSync(filePathImage);

      res.status(200).json({ message: "Data berhasil dihapus", data: deletedModul });
    } else {
      return res.status(404).json({ message: "Modul not found" });
    }
    } catch (error) {
      res.status(400).json({ message: "Data gagal dihapus", error });
    }
  }
}
