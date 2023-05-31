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
          status: "LUNAS",
        },
        include: {
          user: true,
          siswa: true,
        },
      });

      if (!tagihan) {
        res.status(404).json({ message: "tidak riwayat ada tagihan" });
      }
      const tagihanFormat = tagihan.map((tagihan: any) => {
        const formattedTagihan = {
          ...tagihan,
          tanggal_tagihan: format(new Date(tagihan.tanggal_tagihan), "dd-MM-yyyy"),
          tanggal_jatuh_tempo: format(new Date(tagihan.tanggal_jatuh_tempo), "dd-MM-yyyy"),
          tanggal_bayar: format(new Date(tagihan.tanggal_bayar), "dd-MM-yyyy"),
          tanggal_approve: format(new Date(tagihan.tanggal_approve), "dd-MM-yyyy"),
        };
        return formattedTagihan;
      });

      res.status(200).json(tagihanFormat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading riwayat tagihan." });
    }
  }
}
