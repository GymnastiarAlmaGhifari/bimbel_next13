import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import fs from "fs";
import path from "path";
import Image from "next/image";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let nota = req.query.nota as string;
    
    if (req.method === "GET") {
        try {
                const notaPath = path.join('/upload/img/siswa/tagihan', nota);
                //response image from image path
                if (notaPath) {
                    // Read the image file
                    const filePath = path.join(process.cwd(), notaPath);
                    const data = fs.readFileSync(filePath);

                    res.writeHead(200, {
                        "Content-Type": "image/jpeg",
                        "Content-Length": data.length,
                    });

                    res.end(data);

                }
        }
        catch (error) {
            console.error(error);
            const response = {
                status: 500,
                message: "Error memuat nota tagihan",
            };
            return res.status(500).json(response);
        }
    }

}