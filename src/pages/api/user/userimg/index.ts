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
function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

randomString = generateRandomString(6);
console.log(randomString);

// export { modifiedTimefromApiimg };

const readFile = (req: NextApiRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/img/user");
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
    await fs.readdir(path.join(process.cwd() + "/public", "/img", "/user"));

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
    await fs.mkdir(path.join(process.cwd() + "/public", "/img", "/user"));
  }
  await readFile(req, true);
  res.json({ done: "ok" });
};

export default handler;
