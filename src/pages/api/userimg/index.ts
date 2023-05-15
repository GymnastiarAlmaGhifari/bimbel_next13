import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const currentTime = new Date().toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const modifiedTime = currentTime.replaceAll(":", "");

const readFile = (req: NextApiRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/img/user");
    options.filename = (name, ext, path, form) => {
      const extention = path.originalFilename?.split(".").pop();
      return req.headers.from + "-" + modifiedTime + "." + extention;
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

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/img", "/user"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/img", "/user"));
  }
  await readFile(req, true);
  res.json({ done: "ok" });
};

export default handler;
