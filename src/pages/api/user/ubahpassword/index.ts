import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan." });
    } else {
      try {
        bcrypt.compare(password, user.password, async function (err, result) {
          if (err) {
            return res.status(400).json({ message: "Password salah." });
          }
          if (result) {
            const { password_baru } = req.body;
            const user = await prisma.user.update({
              where: {
                email,
              },
              data: {
                password: await bcrypt.hash(password_baru, 10),
              },
            });
            res.status(201).json(user);
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user." });
      }
    }
  }
}
