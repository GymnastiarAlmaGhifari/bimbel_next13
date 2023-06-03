import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let userId = req.query.userId;

  if (Array.isArray(userId)) {
    userId = userId[0];
  }

  if (req.method === "PUT") {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { ...req.body },
      });

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user" });
    }
  } else if (req.method === "DELETE") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        await prisma.user.delete({
          where: { id: userId },
        });

        //delete image user
        const fs = require("fs");
        const path = require("path");
        const filePath = path.join(process.cwd(), "upload", "img", "user", user.image);
        fs.unlinkSync(filePath);

        res.status(200).json(user);
      } else {
        return res.status(404).json({ message: "user not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting user" });
    }
  } else if (req.method === "GET") {
    try {
      const users = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          mapel: true,
        },
      });

      if (!users) {
        return res.status(404).json({ message: "user not found" });
      }

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading user" });
    }
  } else if (req.method === "DELETE") {
    try {
      const users = await prisma.user.update({
        where: { id: userId },
        data: {
          jadwal_details: {
            deleteMany: {},
          },
        },
      });

      const deleted = await prisma.user.delete({
        where: { id: userId },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting user" });
    }
  }
}
