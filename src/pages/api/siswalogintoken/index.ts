import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

//if token match then return login success and the email
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body;
    if (req.method === "POST") {
        try {
            const siswa = await prisma.siswa.findUnique({
                where: { token },
            });
            if (!siswa) {
                const response = {
                    status: 404,
                    message: "User not found",
                };
                return res.status(404).json(response);
            }
            const response = {
                status: 200,
                message: "Login success",
                data: {
                    email: siswa.email,
                },
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
            const response = {
                status: 500,
                message: "Internal server error",
            };
            res.status(500).json(response);
        }
    }
}