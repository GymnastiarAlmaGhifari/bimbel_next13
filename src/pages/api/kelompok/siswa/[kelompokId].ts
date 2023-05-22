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

    try {
      const getsiswa = await prisma.siswa.findMany({
        where: { kelompok_id: kelompokId },
      });

      let allSame = true;

      for (let i = 0; i < getsiswa.length; i++) {
        let found = false;
        for (let j = 0; j < siswabody.length; j++) {
          if (getsiswa[i].id === siswabody[j]) {
            found = true;
            break;
          }
        }
        if (!found) {
          allSame = false;
          try {
            const siswa = await prisma.siswa.update({
              where: { id: getsiswa[i].id },
              data: { kelompok_id: null },
            });
          } catch (error) {
            console.error(error);
            res.status(200).json({
              message: "Tidak ada siswa yang dihapus dari kelompok",
            });
          }
        }
      }

      if (allSame) {
        res.status(200).json({ message: "All data is the same" });
      } else {
        res.status(200).json({ message: "Success" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating siswa" });
    }
  }
}
