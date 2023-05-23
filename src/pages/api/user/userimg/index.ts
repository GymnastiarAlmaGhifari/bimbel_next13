import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import prisma from "@/libs/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};
let randomString: string;


// export { modifiedTimefromApiimg };

const readFile = (req: NextApiRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/upload/img/user");
    options.filename = (name, ext, path, form) => {
      const extention = path.originalFilename?.split(".").pop();
      return req.headers.from + "-" + randomString + "." + extention;
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
    await fs.readdir(path.join(process.cwd() + "/upload", "/img", "/user"));

    randomString = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const user = await prisma.user.update({
        where: { id: req.headers.from },
        data: {
          random: randomString,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user" });
    }
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/upload", "/img", "/user"));
  }
  await readFile(req, true);
  res.json({ done: "ok" });
};

export default handler;
