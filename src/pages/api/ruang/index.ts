import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const ruangs = await prisma.ruang.findMany();
      res.status(200).json(ruangs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading ruangs." });
    }
  } else if (req.method === "POST") {
    const { nama, tipe } = req.body;

    try {
      const ruang = await prisma.ruang.create({
        data: {
          nama,
          tipe,
        },
      });
      res.status(201).json(ruang);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating ruang." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
