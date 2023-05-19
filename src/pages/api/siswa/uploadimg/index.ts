import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import jwt, { JwtPayload } from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: false,
  },
};


const readFile = (req: NextApiRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {

    const token = req.headers.authorization;
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret not defined in environment variables');
    }
    if (!token) {
        throw new Error('Token not found');
    }
    
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/img/siswa");
    options.filename = (name, ext, path, form) => {
      const extention = path.originalFilename?.split(".").pop();
      return decodedToken.id + "." + "jpg";
    };
  }
  options.maxFileSize = 2 * 1024 * 1024;
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
    await fs.readdir(path.join(process.cwd() + "/public", "/img", "/siswa"));

  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/img", "/siswa"));
  }
  await readFile(req, true);
  res.json({ 
        status: 200,
        message: "gambar berhasil diupload",
        data: {}
   });
};

export default handler;
