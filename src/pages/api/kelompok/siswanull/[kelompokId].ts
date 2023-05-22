import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let kelompokId = req.query.kelompokId;

  if (Array.isArray(kelompokId)) {
    kelompokId = kelompokId[0];
  }

  if (req.method === "GET") {
    try {
      const anggota = await prisma.siswa.findMany({
        where: { kelompok_id: kelompokId },
      });

      res.status(200).json(anggota);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading anggota" });
    }
  } else if (req.method === "PUT") {
    const siswabody = req.body.data;

    if (!Array.isArray(siswabody)) {
      res.status(200).json({ message: "Invalid siswabody data" });
      return;
    }

    try {
      const updatePromises = siswabody.map((item: any) => {
        if (item === false) {
          return Promise.resolve(); // Skip updating the false value
        } else {
          return prisma.siswa.update({
            where: { id: item },
            data: { kelompok_id: kelompokId as string },
          });
        }
      });

      await Promise.all(updatePromises);

      res.status(200).json({ message: "Success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating siswa" });
    }
  }
}
