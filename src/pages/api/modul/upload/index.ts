import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import { join } from 'path';
import sharp from 'sharp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const id = req.body.id;

  if (req.method === 'POST') {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    try {
      await page.goto('http://localhost:3000/modul/modul.pdf');
      await page.setViewport({ width: 1080, height: 1920 });
      await page.waitForTimeout(2000);


      const screenshotPath = join(process.cwd(), 'public/modul/thumb', 'temporary.png');
      console.log('Screenshot path: ', screenshotPath);
      await page.screenshot({ path: screenshotPath });

      const x = 310;
    const y = 59;
    const width = 750;
    const height = 1080;

    const outputPath = join(process.cwd(), 'public/modul/thumb', id+'.png');

    await sharp(screenshotPath)
      .extract({ left: x, top: y, width, height })
      .toFile(outputPath);

    console.log('Image cropped successfully!');
    res.status(200).json({ success: true, message: 'Screenshot captured and cropped!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error capturing screenshot', error: error });
  } finally {
    await browser.close();
  }
}
}