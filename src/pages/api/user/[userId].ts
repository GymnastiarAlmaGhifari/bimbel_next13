import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

//used edit with parameter userid
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let userId = req.query.userId;

  if (Array.isArray(userId)) {
    userId = userId[0];
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading user" });
    }
  } else if (req.method === "PUT") {
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
  }
}
