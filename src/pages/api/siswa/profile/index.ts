import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import jwt, { JwtPayload } from "jsonwebtoken";


//if token match then return login success and the email
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization;
    if (req.method === "POST") {
        try {

            if (!process.env.JWT_SECRET) {
                throw new Error('JWT secret not defined in environment variables');
            }
            if (!token) {
                throw new Error('Token not found');
            }

            // Verify the token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

            // Check if the token is expired
            const tokenExpirationDate = new Date(decodedToken.exp! * 1000);
            const currentDateTime = new Date();
            // if (currentDateTime > tokenExpirationDate) {
            //     const response = {
            //         status: 401,
            //         message: "Token expired",
            //     };
            //     return res.status(401).json(response);
            // }

            const siswa = await prisma.siswa.findUnique({
                where: { token },
            });
            if (!siswa) {
                const response = {
                    status: 404,
                    message: "User not found",
                    data: {},
                };
                return res.status(404).json(response);
            }
            //if siswa has kelompok id then respon with kelompok
            if (siswa.kelompok_id) {
                const kelompok = await prisma.kelompok.findUnique({
                    where: { id: siswa.kelompok_id },
                });
                const program = await prisma.program.findUnique({
                    where: { id: kelompok?.program_id },
                });
                const response = {
                    status: 200,
                    message: "Login success",
                    data: {
                        id: siswa.id,
                        name: siswa.nama,
                        email: siswa.email,
                        kelompok: kelompok?.nama_kelompok,
                        Tipe: program?.nama_program,
                    },
                };
                // console.log("token", decodedToken, tokenExpirationDate);
                return res.status(200).json(response);
            }
            //if siswa has no kelompok id then respon without kelompok
            else {
                const response = {
                    status: 200,
                    message: "Login success",
                    data: {
                        id: siswa.id,
                        name: siswa.nama,
                        email: siswa.email,
                        kelompok: null,
                        Tipe: null,
                    },
                };
                return res.status(200).json(response);
            }
        }

        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                const response = {
                  status: 401,
                  message: "Token expired",
                  data: {},
                };
                return res.status(401).json(response);
              }
            console.error(error);
            const response = {
                status: 500,
                message: "Internal server error",
                data: {},
            };
            res.status(500).json(response);
        }
    }
}