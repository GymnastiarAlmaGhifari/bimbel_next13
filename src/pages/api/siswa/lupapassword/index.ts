import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { email, password } = req.body;

    if (req.method === "POST") {
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

            const isValid = await bcrypt.compare(password, siswas.password);
            if (isValid) {
                const response = {
                    status: 401,
                    message: "Password tidak boleh sama dengan sebelumnya",
                    data: {},
                };
                return res.status(401).json(response);
            }

            const updatepassword = await prisma.siswa.update({
                where: {
                    id: siswas.id,
                },
                data: {
                    password: await bcrypt.hash(password, 10),
                },
            });

            res.status(200).json({
                status: 200,
                message: "Berhasil reset password",
                data: {},
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: "Error reset password.",
                data: { error },
            });

        }
    }
}