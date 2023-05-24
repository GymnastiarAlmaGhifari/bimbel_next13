import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let img = req.query.img as string;
    
    if (req.method === "GET") {
        try {
                const imgPath = path.join('/upload/modul/thumb', img);
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
        catch (error) {
            console.error(error);
            const response = {
                status: 500,
                message: "Error memuat thumbnail modul",
            };
            return res.status(500).json(response);
        }
    }

}