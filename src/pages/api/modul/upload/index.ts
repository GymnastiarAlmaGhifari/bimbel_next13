import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import prisma from "@/libs/prismadb";
import { format } from "date-fns";
import axios from "axios";

export const config = {
    api: {
        bodyParser: false,
    },
};

const readFile = (
    req: NextApiRequest,
    saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {

    const options: formidable.Options = {};
    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), "/public/modul/");
        options.filename = (name, ext, path, form) => {
            return "temp.pdf";
        };
    }
    options.maxFileSize = 20 * 1024 * 1024;
    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

const handler: NextApiHandler = async (req, res) => {
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/modul"));

    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/modul"));
        res.status(200).json(error);
    }

    await readFile(req, true);
    res.json({ done: "ok" });
};

export default handler;  