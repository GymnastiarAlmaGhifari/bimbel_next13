import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const sesis = await prisma.sesi.findMany();
      res.status(200).json(sesis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading sesis." });
    }
  } else if (req.method === "POST") {
    const { nama_sesi, jam_mulai, jam_selesai } = req.body;

    // const formattedJamMulai = new Date(jam_mulai).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    // const formattedJamSelesai = new Date(jam_selesai).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // try {
    //     const sesi = await prisma.sesi.create({
    //         data: {
    //             nama_sesi,
    //             jam_mulai: formattedJamMulai,
    //             jam_selesai: formattedJamSelesai,
    //         },
    //     });
    //     res.status(201).json(sesi);
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: "Error creating sesi.", error });
    // }

    // const jamMulai = new Date(jam_mulai);
    // const jamSelesai = new Date(jam_selesai);
    // jamMulai.setHours(jamMulai.getHours() + 7);
    // jamSelesai.setHours(jamSelesai.getHours() + 7);

    // const formatJam = (date: Date) => {
    //   return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    // };

    // try {
    //   const sesi = await prisma.sesi.create({
    //     data: {
    //       nama_sesi,
    //       jam_mulai: formatJam(jamMulai),
    //       jam_selesai: formatJam(jamSelesai),
    //     },
    //   });
    //   res.status(201).json(sesi);
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ message: "Error creating sesi.", error });
    // }

    // ubah format jam_mulai dan jam_selesai menjadi 13:00:00
    // ubah format jam_mulai dan jam_selesai menjadi 13:00:00
    // const jamMulai = new Date(jam_mulai);
    // const jamSelesai = new Date(jam_selesai);
    // jamMulai.setHours(jamMulai.getHours() + 7);
    // jamSelesai.setHours(jamSelesai.getHours() + 7);
    // const jam_mulai2 = jamMulai.toISOString().slice(11, 19);
    // const jam_selesai2 = jamSelesai.toISOString().slice(11, 19);

    try {
      const sesi = await prisma.sesi.create({
        data: {
          nama_sesi,
          jam_mulai,
          jam_selesai,
        },
      });
      res.status(201).json(sesi);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating sesi." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
