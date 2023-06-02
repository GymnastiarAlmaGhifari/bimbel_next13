import { NextApiRequest, NextApiResponse } from "next";
import puppeteer, { Frame } from "puppeteer";
import path, { join } from "path";
import sharp from "sharp";
import fs from "fs-extra";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.body.id;

  const array: string[] = [];

  if (req.method === "POST") {
    const sourcePath = path.join(process.cwd(), "/upload/modul/temp.pdf");
    const destinationPath = path.join(process.cwd(), "/upload/modul/temp.pdf");
    const newFileName = id + ".pdf";

    try {
      const destinationDir = path.dirname(destinationPath);
      const newFilePath = path.join(destinationDir, newFileName);

      await fs.copy(sourcePath, newFilePath);
      array.push("File copied successfully.");

      const browser = await puppeteer.launch({
        headless: "new",
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],

      });
      // const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();

      try {
        await page.goto(process.env.NEXTAUTH_URL + "/api/modul/pdf?modul=" + id + ".pdf");
        await page.setViewport({ width: 800, height: 1000 });
        await page.waitForTimeout(4000);

        const screenshotPath = join(process.cwd(), "upload/modul/thumb", "temporary.png");
        await page.screenshot({ path: screenshotPath });

        const x = 305;
        const y = 58;
        const width = 490;
        const height = 615;

        const outputPath = join(process.cwd(), "upload/modul/thumb", id + ".png");

        await sharp(screenshotPath).extract({ left: x, top: y, width, height }).toFile(outputPath);

        array.push("Screenshot captured and cropped!");

        await prisma.module.update({
          where: {
            id: id,
          },
          data: {
            thumbnail: id + ".png",
            url: id + ".pdf",
          },
        });
        res.status(200).json(array);
      } catch (error) {
        res.status(500).json({ success: false, message: "Error capturing screenshot", error: error });
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error("Error copying file", error);
      res.status(500).json({ error: "Error copying file." });
    }
  }
}
