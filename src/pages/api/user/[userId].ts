import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";

//used edit with parameter userid
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
    fs.readdir(directory)
      .then((files) => {
        console.log("Filenames in directory:", files); // log the filenames
        const foundFile = files.find((file) => path.parse(file).name === filenameWithoutExt);
        if (foundFile) {
          filePath = path.join(foundFile);
          console.log("Found file:", filePath);
          return filePath.toString();
        } else {
          const foundFileWithExt = files.find((file) => file.startsWith(filenameWithoutExt + "."));
          if (foundFileWithExt) {
            filePath = path.join(foundFileWithExt);
            console.log("Found file:", filePath);
            return filePath.toString();
          } else {
            console.log("File not found");
          }
        }
      })
      .catch((err) => console.error(err));

      const { name, email, role, password, nomor_telepon, alamat, image, universitas, mapel_id } = req.body;
      
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name,
          email: email,
//          password: await bcrypt.hash(password, 10),
          role: role,
          nomor_telepon: nomor_telepon,
          alamat: alamat,
          image: filePath,
          universitas: universitas,
          mapel_id: mapel_id,
        },
      });
      console.log("image", filePath);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user" });
    }
  }
}
