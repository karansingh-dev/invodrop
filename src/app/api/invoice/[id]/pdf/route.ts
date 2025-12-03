import { generatePdfFromUrl } from "@/utils/generate-pdf";
import { getUser } from "@/utils/get-user";
import { createPdfToken } from "@/utils/pdf-token";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await getUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Forbidden", error: "No user session" },
        {
          status: 403,
        }
      );
    }
    const token = createPdfToken({ invoiceId: id });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      `http://localhost:${process.env.PORT ?? 3000}`;

    const cleanBase = baseUrl.replace(/\/$/, "");
    const url = `${cleanBase}/pdf-view/${id}/${token}`;

    const pdfBuffer = await generatePdfFromUrl(url);

    const buffer = Buffer.from(pdfBuffer);
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${id}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("PDF generation failed", { status: 500 });
  }
}
