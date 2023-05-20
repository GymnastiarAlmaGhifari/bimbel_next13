import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";
import axios from "axios";

const host = process.env.NEXTAUTH_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const siswas = await prisma.siswa.findMany({
        include: {
          kelompok: {
            include: {
              program: {
                include: {
                  kelas: true,
                },
              },
            },
          },
        },
      });
      res.status(200).json(siswas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading siswas." });
    }
  } else if (req.method === "POST") {
    const { nama, email, password, nomor_telepon, hp_ortu, alamat, sekolah } = req.body;

    try {
      const siswa = await prisma.siswa.create({
        data: {
          nama,
          email,
          password: await bcrypt.hash(password, 10),
          nomor_telepon,
          hp_ortu,
          alamat,
          sekolah,
        },
      });

      try {
      const response = await axios.post(host + "/api/siswa/cp", {
        id: siswa.id,
      });
      const update = await prisma.siswa.update({
        where: {
          id: siswa.id,
        },
        data: {
          image: siswa.id + ".jpg",
        },
      });
      res.status(201).json(siswa);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating image siswa.", error });
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating siswa.", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
