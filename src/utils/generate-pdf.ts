import puppeteer from "puppeteer";

export async function generatePdfFromUrl(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 1600,
    deviceScaleFactor: 2,
  });

  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      right: "15mm",
      bottom: "20mm",
      left: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}
