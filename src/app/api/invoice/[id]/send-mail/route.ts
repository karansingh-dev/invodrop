import { after } from "next/server";
import { sendEmail } from "@/lib/node-mailer";
import prisma from "@/lib/prisma";
import { generatePdfFromUrl } from "@/utils/generate-pdf";
import { getUser } from "@/utils/get-user";
import { handleError } from "@/utils/handle-error";
import { createPdfToken } from "@/utils/pdf-token";
import { renderTemplate } from "@/utils/render-ejs-template";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Forbidden", error: "No user session" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!invoice) {
      return Response.json(
        {
          success: false,
          message: "No invoice found",
          error: "No invoice found",
        },
        { status: 404 }
      );
    }

    const token = createPdfToken({ invoiceId: id });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      `http://localhost:${process.env.PORT ?? 3000}`;

    const cleanBase = baseUrl.replace(/\/$/, "");
    const url = `${cleanBase}/pdf-view/${id}/${token}`;

    //  Schedule background work after the response is sent
    after(async () => {
      try {
        const pdfBuffer = await generatePdfFromUrl(url);

        const html = renderTemplate("pdf-main", {
          clientName: invoice.client.name,
          invoiceNumber: invoice.invoiceNumber,
          year: "2025",
        });
        await sendEmail(invoice.client.email, "Invoice PDF", html, {
          filename: `invoice-${id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        });

        console.log("Invoice email task completed");
      } catch (err) {
        console.error("Background email task failed:", err);
      }
    });

    // Respond immediately
    return Response.json(
      {
        success: true,
        message: "PDF email job queued (will be sent shortly)",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError({
      error,
      message: "Failed to queue pdf email job",
      route: req.url,
    });
  }
}
