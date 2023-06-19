import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import fs from "fs";
import path from "path";
// import randomString from "@/pages/api/userimg/randomstring";

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

    try {
      const users = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!users) {
        return res.status(404).json({ message: "User not found" });
      }

      const img = JSON.stringify(users.image);


      const imagePath = path.join(process.cwd(), "upload", "img", "user", img);

      try {

        const directory = path.join(process.cwd(), "upload", "img", "user");
        const filenameWithoutExt = userId;
        console.log("Filename without extension:", filenameWithoutExt);

        let filePath;
        try {
          const files = await fs.promises.readdir(directory);
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

        try {
          const user = await prisma.user.update({
            where: { id: userId },
            data: {
              image: filePath,
            },
          });

          console.log("image", filePath);
          res.status(200).json(user);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error updating user" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading users." });
    }
  }
}
