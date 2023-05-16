import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import Program from "@/pages/pengaturan/program";

//if token match then return login success and the email
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const  token  = req.headers.authorization;
    if (req.method === "POST") {
        try {
            const siswa = await prisma.siswa.findUnique({
                where: {token} ,
            });
            if (!siswa) {
                const response = {
                    status: 404,
                    message: "User not found",
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
            console.error(error);
            const response = {
                status: 500,
                message: "Internal server error",
            };
            res.status(500).json(response);
        }
    }
}