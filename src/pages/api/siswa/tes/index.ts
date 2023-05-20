import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";
import axios from "axios";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const cpFilePath = path.join(__dirname, "cp");

console.log(cpFilePath);
res.status(200).json(cpFilePath);
    }
}