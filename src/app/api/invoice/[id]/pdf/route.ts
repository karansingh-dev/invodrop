import { createPdfToken } from "@/utils/pdf-token";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const token = createPdfToken({ invoiceId: id });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const invoiceUrl = `${baseUrl}/pdf-view/${id}/${token}`;

    try {
      new URL(invoiceUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL configuration" },
        { status: 500 }
      );
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    await page.goto(invoiceUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.waitForSelector("table", { timeout: 10000 });

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

    const buffer = Buffer.from(pdfBuffer);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${id}.pdf"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
