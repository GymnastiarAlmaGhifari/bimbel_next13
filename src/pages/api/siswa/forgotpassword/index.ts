import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import EmailServices from "@/pages/api/service/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization;
    let OTP_base: string | undefined = undefined;
    const { OTP } = req.body;

    if (req.method === "GET") {
        try {
            const siswas = await prisma.siswa.findUnique({
                where: {
                    token: token,
                },
            });
            if (!siswas) {
                return res.status(404).json({
                    status: 404,
                    message: "Pengguna tidak ditemukan",
                    data: {},
                });
            }

            OTP_base = Math.floor(100000 + Math.random() * 900000).toString();
            EmailServices.sendEmailResetPassword(siswas.email, OTP_base);

            const response = {
                status: 200,
                message: "Berhasil mengirim OTP",
                data: {
                    OTP: OTP_base,
                },
            }

            res.status(200).json(response);
            return OTP_base;
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                status: 500,
                message: "Error reset password.",
                data: {error}, });

        }
    } else if (req.method === "POST") {

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