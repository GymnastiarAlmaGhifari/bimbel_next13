import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import { Hari } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let jadwaldetailId = req.query.jadwaldetailId;

    if (Array.isArray(jadwaldetailId)) {
        jadwaldetailId = jadwaldetailId[0];
    }

    if (req.method === "GET") {
        try {
            const jadwaldetail = await prisma.jadwal_detail.findUnique({
                where: { id: jadwaldetailId },
            });

            if (!jadwaldetail) {
                return res.status(404).json({ message: "Detail jadwal not found" });
            }

            res.status(200).json(jadwaldetail);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error loading detail jadwal" });
        }
    }

    else if (req.method === "PUT") {

          
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
                    return res.status(401).json({ message: "Jadwal sudah dipakai " + getjadwaldetail[0].id });
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
                        hari : {
                            in: [req.body.hari as Hari],
                        },
                    },
                });

                for (let i = 0; i < jadwaluser.length; i++) {
                    if (jadwaluser[i].user_id === req.body.user_id) {
                        return res.status(401).json({ message: "Tentor sudah punya jadwal di sesi ini" });
                    }
                }

            const jadwaldetail = await prisma.jadwal_detail.update({
                where: { id: jadwaldetailId },
                data: { ...req.body },
            });

            return res.status(200).json(jadwaldetail);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating detail jadwal" });
        }
    }
}