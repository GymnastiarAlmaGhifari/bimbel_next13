import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import EmailServices from "@/pages/api/service/email";

let OTP_base: number;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, OTP } = req.body;

    if (req.method === "PUT") {
        try {
            const siswas = await prisma.siswa.findUnique({
                where: {
                    email: email,
                },
            });
            if (!siswas) {
                return res.status(404).json({
                    status: 404,
                    message: "Pengguna tidak ditemukan",
                    data: {},
                });
            }

            OTP_base = Math.floor(100000 + Math.random() * 900000);
            EmailServices.sendEmailResetPassword(siswas.email, OTP_base);

            const response = {
                status: 200,
                message: "Berhasil mengirim OTP ke email",
                data: {
                    OTP: OTP_base,
                },
            }

            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                status: 500,
                message: "Error reset password.",
                data: {error}, });

        }
    } else if (req.method === "POST") {

        console.log("hehehe", OTP_base);

        if (OTP === OTP_base)  {
            const response = {
                status: 200,
                message: "Berhasil verifikasi OTP",
                data: {},
        }

            res.status(200).json(response);
        } else {
            const response = {
                status: 401,
                message: "OTP tidak valid",
                data: {},
            }

            res.status(401).json(response);
        }
    }
}