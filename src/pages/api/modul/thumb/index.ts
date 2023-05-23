import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer, { Frame } from 'puppeteer';
import path, { join } from 'path';
import sharp from 'sharp';
import fs from 'fs-extra';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const id = req.body.id;

  const array: string[] = [];

  if (req.method === 'POST') {

    const sourcePath = path.join(process.cwd(), "/public/modul/temp.pdf");
    const destinationPath = path.join(process.cwd(), '/public/modul/temp.pdf');
    const newFileName = id + ".pdf";

    try {
      const destinationDir = path.dirname(destinationPath);
      const newFilePath = path.join(destinationDir, newFileName);

      await fs.copy(sourcePath, newFilePath);
      array.push('File copied successfully.');

      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();

      try {
        await page.goto(process.env.NEXTAUTH_URL + '/modul/' + id + '.pdf');
        await page.setViewport({ width: 1080, height: 1920 });
        await page.waitForTimeout(2000);


        const screenshotPath = join(process.cwd(), 'public/modul/thumb', 'temporary.png');
        await page.screenshot({ path: screenshotPath });

        const x = 310;
        const y = 59;
        const width = 750;
        const height = 1000;

        const outputPath = join(process.cwd(), 'public/modul/thumb', id + '.png');

        await sharp(screenshotPath)
          .extract({ left: x, top: y, width, height })
          .toFile(outputPath);

        array.push('Screenshot captured and cropped!');
        res.status(200).json(array);
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error capturing screenshot', error: error });
      } finally {
        await browser.close();
      }

    } catch (error) {
      console.error('Error copying file', error);
      res.status(500).json({ error: 'Error copying file.' });
    }


  }
}