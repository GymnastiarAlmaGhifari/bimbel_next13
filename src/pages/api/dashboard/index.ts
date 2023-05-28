import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import { Bulan, Hari } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const role = req.query.role;
  let user_id = req.query.user_id;

  if (Array.isArray(user_id)) {
    user_id = user_id[0];
  }

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const day = now.getDay();

  const dayname = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];

  const hari = dayname[day];

  const monthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

  const currentMonthName = monthNames[month];

  if (role === "SUPER") {
    if (req.method === "GET") {
      try {
        const total_tentor = await prisma.user.count({
          where: {
            role: "TENTOR",
          },
        });
        const total_siswa = await prisma.user.count();
        const total_tagihan = await prisma.tagihan.aggregate({
          _sum: {
            jumlah_tagihan: true,
          },
          where: {
            status: "LUNAS",
            Bulan: {
              in: [currentMonthName as Bulan],
            },
            Tahun: year,
          },
        });

        const jadwal = await prisma.jadwal_detail.findMany({
          where: {
            hari: {
              in: [hari as Hari],
            },
            user_id: user_id,
          },
          include: {
            kelompok: {
              include: {
                program: true,
              },
            },
            sesi: true,
            mapel: true,
            ruang: true,
            user: true,
          },
        });

        const response = {
          total_tentor,
          total_siswa,
          total_tagihan,
          jadwal,
        };

                return res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    message: "Error memuat data",
                    data: {},
                });
            }
        } else {
            res.status(405).json({
                status: 405,
                message: "Method not allowed",
                data: {},
            });
        }
    } else if (role === "ADMIN") {
        if (req.method === "GET") {
            try {
                const total_tentor = await prisma.user.count({
                    where: {
                        role: "ADMIN",
                    },
                });
                const total_siswa = await prisma.user.count();
                const total_tagihan = await prisma.tagihan.aggregate({
                    _sum: {
                        jumlah_tagihan: true,
                    },
                    where: {
                        status: "LUNAS",
                        Bulan: {
                            in: [currentMonthName as Bulan],
                        },
                        Tahun: year,
                    },
                });

                const jadwal = await prisma.jadwal_detail.findMany({
                    where: {
                        hari: {
                            in: [hari as Hari],
                        },
                        user_id: user_id,
                    },
                    include: {
                        kelompok: {
                            include: {
                                program: true,
                            },
                        },
                        sesi: true,
                        mapel: true,
                        ruang: true,
                    },
                });

                const response = {
                    total_tentor,
                    total_siswa,
                    total_tagihan,
                    jadwal,
                };

                return res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    message: "Error memuat data",
                    data: {},
                });
            }
        } else {
            res.status(405).json({
                status: 405,
                message: "Method not allowed",
                data: {},
            });
        }
    } else if (role === "TENTOR") {
        if (req.method === "GET") {
            try {
                const total_tentor = await prisma.user.count({
                    where: {
                        role: "TENTOR",
                    },
                });
                const total_siswa = await prisma.user.count();
                const jadwal = await prisma.jadwal_detail.findMany({
                    where: {
                        hari: {
                            in: [hari as Hari],
                        },
                        user_id: user_id,
                    },
                    include: {
                        kelompok: {
                            include: {
                                program: true,
                            },
                        },
                        sesi: true,
                        mapel: true,
                        ruang: true,
                    },
                });

                const total_jadwal = await prisma.jadwal_detail.count({
                    where: {
                        hari: {
                            in: [hari as Hari],
                        },
                        user_id: user_id,
                    },
                });


                const response = {
                    total_jadwal,
                    total_siswa,
                    jadwal,
                };

                return res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    message: "Error memuat data",
                    data: {},
                });
            }
        } else {
            res.status(405).json({
                status: 405,
                message: "Method not allowed",
                data: {},
            });
        }
    }
}
