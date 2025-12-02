
import jwt from "jsonwebtoken";

const SECRET = process.env.PDF_TOKEN_SECRET!;
const EXP = Number(process.env.PDF_TOKEN_EXPIRY_SECONDS || 300);

export function createPdfToken(payload: {
  invoiceId: string;
  purpose?: string;
}) {
  return jwt.sign(
    {
      invoiceId: payload.invoiceId,
      purpose: payload.purpose || "invoice_pdf",
    },
    SECRET,
    { expiresIn: `${EXP}s` }
  );
}

export function verifyPdfToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET) 
    return { valid: true, payload: decoded };
  } catch (err: unknown) {
    return { valid: false, error: err || "invalid token" };
  }
}
