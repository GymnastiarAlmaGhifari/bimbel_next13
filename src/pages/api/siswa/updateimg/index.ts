import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import prisma from "@/libs/prismadb";
import { Express } from "express";
import express from "express";
import serveStatic from "serve-static";
import formidable from "formidable";

const app: Express = express();

app.use(serveStatic(path.join(process.cwd(), "../public")));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      await getImage(req, res);
      break;
    case "POST":
      await uploadImage(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getImage(req: NextApiRequest, res: NextApiResponse) {

  const token = req.headers.authorization;


  const siswas = await prisma.siswa.findUnique({
    where: {
      token: token,
    },
  });

  const filePath = path.join(process.cwd(),
    `/public/img/siswa/${siswas?.id}`
  );

  console.log(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(404).json({
        status: 404,
        message: "gambar tidak ditemukan",
        data: {},
    });
    }

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": data.length,
    });
    res.end(data);
  });
}

async function uploadImage(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm({});
  const token = req.headers.authorization;

  try {
  form.parse(req, async (err, fields, files: any) => {
    console.log(token);

    let userData: any;

      const siswas = await prisma.siswa.findUnique({
        where: {
          token: token,
        },
      });
      

    const oldPath = files.file.path;

    console.log(oldPath);
    const newPath = path.join(process.cwd(),
      `/public/img/siswa/${siswas?.id}`
    );

    fs.copyFile(oldPath, newPath, (err) => {
      if (err) throw err;
    });

    const result = {
      status: 200,
      message: "Berhasil upload gambar",
      data: {
        id : siswas?.id,
        name: siswas?.nama,
        email: siswas?.email,
        image: siswas?.image,
      },
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(result);
    return;
  });
} catch (error) {
  console.error(error);
  const response = {
    status: 500,
    message: "Error memuat siswa",
  };
  return res.status(500).json(response);
}
}
