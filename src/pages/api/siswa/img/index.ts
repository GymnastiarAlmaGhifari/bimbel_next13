import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import fs from "fs";
import { headers } from "next/dist/client/components/headers";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization;

    if (req.method === "GET") {
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
            //if siswa has kelompok id then respon with kelompok
            else {
                const imgPath = siswa.image ? siswa.image : null;
                console.log(imgPath);
                //response image from image path
                if (imgPath) {
                    // Read the image file
                    const filePath = path.join(process.cwd(), imgPath);
                    const data = fs.readFileSync(filePath);

                    res.writeHead(200, {
                        "Content-Type": "image/jpeg",
                        "Content-Length": data.length,
                    });

                    res.end(data);

                }
            }
        }
        catch (error) {
            console.error(error);
            const response = {
                status: 500,
                message: "Error loading siswa",
            };
            return res.status(500).json(response);
        }
    }

}