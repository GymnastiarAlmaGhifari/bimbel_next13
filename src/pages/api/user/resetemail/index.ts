import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import EmailServices from "@/pages/api/service/email";

let OTP_base: number;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string;
  const OTP = req.body.OTP;

  if (req.method === "GET") {
    try {
      const users = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!users) {
        return res.status(404).json({
          status: 404,
          message: "Pengguna tidak ditemukan",
          data: {},
        });
      }

      OTP_base = Math.floor(100000 + Math.random() * 900000);
      EmailServices.sendEmailResetPassword(users.email, OTP_base);

      const response = {
        status: 200,
        message: "Berhasil mengirim OTP ke email",
      };

      res.status(200).json(response);
      console.log("OTP", OTP_base);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Error reset password.",
        data: { error },
      });
    }
  } else if (req.method === "POST") {
    console.log("hehehe", OTP_base, OTP);

    if (OTP === OTP_base) {
      const response = {
        status: 200,
        message: "Berhasil verifikasi OTP",
      };

      res.status(200).json(response);
    } else {
      const response = {
        status: 401,
        message: "OTP tidak valid",
      };

      res.status(401).json(response);
    }
  }
}
