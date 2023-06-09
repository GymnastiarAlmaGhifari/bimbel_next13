import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

//if email and password match then update token from body
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password, token } = req.body;
    
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
        
        const updateSiswa = await prisma.siswa.update({
            where: { id: siswa.id },
            data: { token: token },
        });
        
        const response = {
            status: 200,
            message: "Update token success",
            data: {
            id: updateSiswa.id,
            name: updateSiswa.nama,
            email: updateSiswa.email,
            token: updateSiswa.token,
            
            }
        }
        res.status(200).json(response);
        } catch (error) {
        console.error(error);
        const response = {
            status: 500,
            message: "Internal server error",
        };
        res.status(500).json(response);
        }
    }

}