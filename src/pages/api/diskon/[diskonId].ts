import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.diskonId as string;

  if (req.method === "GET") {
    try {
      const diskon = await prisma.diskon.findUnique({
        where: {
          id: id,
        },
      });

      res.status(200).json(diskon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading diskon" });
    }
  } else if (req.method === "PUT") {
    try {
      const diskon = await prisma.diskon.update({
        where: {
          id: id,
        },
        data: {
          nama_diskon: req.body.nama_diskon,
        },
      });

      res.status(200).json(diskon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating diskon" });
    }
  } else if (req.method === "DELETE") {
    try {
      const diskon = await prisma.diskon.findUnique({
        where: {
          id: id,
        },
      });
      if (diskon) {
        await prisma.diskon.delete({
          where: {
            id: id,
          },
        });

        //delete diskon img 
        const fs = require("fs");
        const path = require("path");
        const filePath = path.join(process.cwd(), "upload", "img", "diskon", diskon.banner);

        res.status(200).json(diskon);
      } else {
        res.status(404).json({ message: "Diskon not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting diskon" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
