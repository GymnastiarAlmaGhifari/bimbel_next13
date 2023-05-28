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

const readFile = (req: NextApiRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/upload/img/program");
    options.filename = (name, ext, path, form) => {
      return req.headers.from + ".jpg";
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
  const directoryPath = path.join(process.cwd(), "/upload/img/program");

  try {
    await fs.access(directoryPath);
  } catch (error) {
    // Directory does not exist, create it
    await fs.mkdir(directoryPath);
  }

  try {
    await readFile(req, true);

    // const update = await prisma.program.update({
    //   where: { id: req.headers.from },
    //   data: {
    //     img: req.headers.from + ".jpg",
    //   },
    // });

    res.json({ done: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
