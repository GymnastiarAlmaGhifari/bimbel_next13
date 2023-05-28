import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import { Bulan } from "@prisma/client";
import { format } from "date-fns";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let Bulan = req.query.Bulan as Bulan | null | undefined;
  let Tahun = Number(req.query.Tahun);

  if (req.method === "GET") {
    try {
      const tagihan = await prisma.tagihan.findMany({
        where: {
          status: {
            not: "LUNAS",
          },
        },
        include: {
          user: true,
          siswa: true,
        },
      });

      if (!tagihan) {
        return res.status(404).json({ message: "belum ada tagihan" });
      }

      const tagihanFormat = tagihan.map((tagihan: any) => {
        const formattedTagihan = {
          ...tagihan,
          tanggal_tagihan: format(new Date(tagihan.tanggal_tagihan), 'dd-MM-yyyy'),
          tanggal_jatuh_tempo: format(new Date(tagihan.tanggal_jatuh_tempo), 'dd-MM-yyyy'),
          tanggal_bayar: format(new Date(tagihan.tanggal_bayar), 'dd-MM-yyyy'),
          tanggal_approve: format(new Date(tagihan.tanggal_approve), 'dd-MM-yyyy'),
        };
        return formattedTagihan;
      });

      if (!tagihan) {
        res.status(404).json({ message: "tidak ada tagihan" });
      }
      return res.status(200).json(tagihanFormat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading tagihan." });
    }
  } else if (req.method === "POST") {
    try {
      const tagihan = await prisma.tagihan.findMany({
        where: {
          siswa_id: req.body.siswa_id,
          Bulan: Bulan,
          Tahun: Tahun,
        },
        include: {
          user: true,
        },
      });

      //if tagihan not null
      if (tagihan.length > 0) {
        res.status(200).json({ message: "Tagihan sudah ada." });
      } else {
        try {
          const tagihan = await prisma.tagihan.create({
            data: { ...req.body },
          });
          res.status(200).json(tagihan);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error creating tagihan.", error });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading tagihan." });
    }
  }
}
