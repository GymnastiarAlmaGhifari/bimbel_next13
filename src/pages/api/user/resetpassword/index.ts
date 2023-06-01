import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { email, password } = req.body;

    if (req.method === "POST") {
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
                });
            }

            const update = await prisma.user.update({
                where: {
                    id: users.id,
                },
                data: {
                    password: await bcrypt.hash(password, 10),
                },
            });

            res.status(200).json({
                status: 200,
                message: "Berhasil reset password",
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