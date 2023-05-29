import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tagihanId = req.query.tagihanId as string;

  if (req.method === "DELETE") {
    try {
      const tagihan = await prisma.tagihan.delete({
        where: {
          id: tagihanId,
        },
      });

      res.status(200).json(tagihan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting tagihan" });
    }
  }

  if (req.method === "PUT") {
    try {
      const tagihan = await prisma.tagihan.update({
        where: {
          id: tagihanId,
        },
        data: req.body,
      });

      res.status(200).json(tagihan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating tagihan" });
    }
  }
}
