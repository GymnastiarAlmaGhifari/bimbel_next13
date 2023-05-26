import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import { Hari } from "@prisma/client";

//input json jadwal id and return jadwal detail
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const kelompokId = req.query.kelompok_id;

  if (req.method === "GET") {
    try {
      const jadwal = await prisma.jadwal_detail.findMany({
        where: { kelompok_id: kelompokId as string },
      });
      if (!jadwal) {
        const response = {
          status: 404,
          message: "Jadwal not found",
        };
        return res.status(404).json(response);
      }
      const response = {
        status: 200,
        message: "Jadwal detail",
        data: jadwal,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      const response = {
        status: 500,
        message: "Internal server error",
      };
      return res.status(500).json(response);
    }
  } else if (req.method === "POST") {
    try {
      const getjadwaldetail = await prisma.jadwal_detail.findMany({
        where: {
          hari: {
            in: [req.body.hari as Hari],
          },
          sesi_id: req.body.sesi_id,
          ruang_id: req.body.ruang_id,
        },
      });

      if (getjadwaldetail.length > 0) {
        return res.status(401).json({ message: "Jadwal sudah dipakai " });
      }

      const gettentor = await prisma.user.findUnique({
        where: { id: req.body.user_id },
      });

      // console.log(gettentor?.mapel_id + " " + req.body.mapel_id);
      if (!gettentor?.mapel_id === req.body.mapel_id) {
        return res.status(401).json({ message: "Tentor tidak mengajar mapel ini" });
      }

      const jadwaluser = await prisma.jadwal_detail.findMany({
        where: {
          sesi_id: req.body.sesi_id,
          hari: {
            in: [req.body.hari as Hari],
          },
        },
      });

      for (let i = 0; i < jadwaluser.length; i++) {
        if (jadwaluser[i].user_id === req.body.user_id) {
          return res.status(401).json({ message: "Tentor sudah punya jadwal di sesi ini" });
        }
      }

      const jadwal = await prisma.jadwal_detail.create({
        data: { ...req.body },
      });
      const response = {
        status: 200,
        message: "Jadwal detail created",
        data: jadwal,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      const response = {
        status: 500,
        message: "Internal server error",
      };
      return res.status(500).json(response);
    }
  } else {
    const response = {
      status: 405,
      message: "Method not allowed",
    };
    return res.status(405).json(response);
  }
}
