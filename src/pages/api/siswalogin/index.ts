import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

//used login with parameter email and password
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    
    if (req.method === "POST") {
        try {
        const siswa = await prisma.siswa.findUnique({
            where: { email },
        });
    
        if (!siswa) {
            const response = {
                status: 404,
                message: "User not found",
                };
                return res.status(404).json(response);
        }
    
        const isValid = await bcrypt.compare(password, siswa.password);
        if (!isValid) {
            const response = {
                status: 401,
                message: "Invalid password",
            };
            return res.status(401).json(response);
        }
        
        const response = {
            status: 200,
            message: "Login success",
            data: {
            id: siswa.id,
            name: siswa.nama,
            email: siswa.email,
            nomor: siswa.nomor_telepon,
            alamat: siswa.alamat,
            sekolah: siswa.sekolah,
            nomor_ortu: siswa.hp_ortu,
            
            }
        }
        res.status(200).json(response);
        } catch (error) {
        console.error(error);
        const response = {
            status: 500,
            message: "Internal server error",
            error: error
        };
        res.status(500).json(response);
        }
    }
    }