import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import fs from "fs/promises";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let userId = req.query.userId;

  if (Array.isArray(userId)) {
    userId = userId[0];
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading user" });
    }
  } else if (req.method === "PUT") {
    const directory = path.join(process.cwd(), "public", "img", "user");
    const filenameWithoutExt = userId;

    let filePath;
    try {
      const files = await fs.readdir(directory);
      console.log("Filenames in directory:", files); // log the filenames
      const foundFile = files.find((file) => path.parse(file).name === filenameWithoutExt);
      if (foundFile) {
        filePath = path.join(foundFile);
        console.log("Found file:", filePath);
      } else {
        const foundFileWithExt = files.find((file) => file.startsWith(filenameWithoutExt + "."));
        if (foundFileWithExt) {
          filePath = path.join(foundFileWithExt);
          console.log("Found file:", filePath);
        } else {
          console.log("File not found");
        }
      }
    } catch (err) {
      console.error(err);
    }

    const { name, email, password, role, nomor_telepon, alamat, universitas, mapel_id } = req.body;
    const image = "/img/user/" + filePath;
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name,
          email: email,
          password: password,
          role: role,
          nomor_telepon: nomor_telepon,
          alamat: alamat,
          image: image,
          universitas: universitas,
          mapel_id: mapel_id,
        },
      });

      console.log("image", image);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user" });
    }
  }
}
