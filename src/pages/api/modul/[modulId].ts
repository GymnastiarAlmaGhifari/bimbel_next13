import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

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
      const deletedModul = await prisma.module.delete({
        where: { id },
      });

      res.status(200).json({ message: "Data berhasil dihapus", data: deletedModul });
    } catch (error) {
      res.status(400).json({ message: "Data gagal dihapus", error });
    }
  }
}
