import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

//used login with parameter email and password
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    
    if (req.method === "POST") {
        try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }
        
        const response = {
            status: 200,
            message: "Login success",
            data: res.json(user)
        }
        res.status(200).json(response);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading user" });
        }
    }
    }