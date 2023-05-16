import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import prisma from "@/libs/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};
let siswaId: string;

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const  token  = req.headers.authorization;
    try {
        const siswa = await prisma.siswa.findUnique({
            where: {token} ,
        });
        if (!siswa) {
            const response = {
                status: 404,
                message: "User not found",
            };
            return res.status(404).json(response);
        } else {
            siswaId = siswa.id;
        }
    } catch (error) {
        console.error(error);
        const response = {
            status: 500,
            message: "Internal server error",
        };
        res.status(500).json(response);
    }
}

// const currentTime = new Date().toLocaleTimeString([], {
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit",
//   hour12: false,
// });

// const modifiedTime = currentTime.replaceAll(":", "");

const readFile = (req: NextApiRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/img/siswa");
    options.filename = (name, ext, path, form) => {
      const extention = path.originalFilename?.split(".").pop();
      return siswaId + "-" + "." + extention;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const dbhandler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/img", "/siswa"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/img", "/siswa"));
  }
  await readFile(req, true);
  res.json({ done: "ok" });
};

export default handler;