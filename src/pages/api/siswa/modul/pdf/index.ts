import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import fs from "fs";
import path from "path";
import Image from "next/image";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let modul = req.query.modul as string;
    
    if (req.method === "GET") {
        try {
                const pdfPath = path.join('/upload/modul', modul);
                //response image from image path
                if (pdfPath) {
                    // Read the image file
                    const filePath = path.join(process.cwd(), pdfPath);
                    const data = fs.readFileSync(filePath);

                    res.writeHead(200, {
                        "Content-Type": "application/pdf",
                        "Content-Length": data.length,
                    });

                    res.end(data);

                }
        }
        catch (error) {
            console.error(error);
            const response = {
                status: 500,
                message: "Error memuat pdf: " + error,
            };
            return res.status(500).json(response);
        }
    }

}