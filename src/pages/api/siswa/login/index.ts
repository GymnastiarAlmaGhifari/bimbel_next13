import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
                message: "Pengguna tidak ditemukan",
                data: {},
                };
                return res.status(404).json(response);
        }
    
        const isValid = await bcrypt.compare(password, siswa.password);
        if (!isValid) {
            const response = {
                status: 401,
                message: "Password salah",
                data: {},
            };
            return res.status(401).json(response);
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT secret not defined in environment variables');
          }
        //generate token using jwt
        const secret=process.env.JWT_SECRET;
        const payload = {
            id: siswa.id,
            name: siswa.nama,
          };
        const token = jwt.sign(payload, secret, {
            //expires in 1 minute
            expiresIn: "7d",
        });
        //update token to database
        const updatetoken = await prisma.siswa.update({
            where: { id: siswa.id },
            data: { token,
             },
        });

        const response = {
            status: 200,
            message: "Login berhasil",
            data: {
            // email: siswa.email,
            token: token,
            // nomor: siswa.nomor_telepon,
            // alamat: siswa.alamat,
            // sekolah: siswa.sekolah,
            // nomor_ortu: siswa.hp_ortu,
            
            }
        }
        res.status(200).json(response);
        } catch (error) {
        console.error(error);
        const response = {
            status: 500,
            message: "Error login",
            data: {},
        };
        res.status(500).json(response);
        }
    }
    }