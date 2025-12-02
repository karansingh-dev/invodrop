import z from "zod";

const invoiceItem = z.object({
  name: z.string(),
  description: z.string().optional(),

  unitPrice: z.number(),
  quantity: z.number(),

  taxRate: z.number().optional(),
  taxAmount: z.number().optional(),

  totalAmount: z.number(),
});

export const newInvoiceSchema = z.object({
  clientEmail: z.email(),

  issueDate: z.coerce.date(),
  dueDate: z.coerce.date(),

  currency: z.string(),
  paymentTerm: z.string(),

  invoiceItems: z.array(invoiceItem),

  subTotal: z.number(),
  taxAmount: z.number().optional(),
  grandTotal: z.number(),
  taxRate: z.number().nonnegative().max(999.9999).optional(),
  balanceDue: z.number(),

  footerNote: z.string().optional(),
});

export const invoiceStatusSchemaForApi = z.object({
  status: z.enum(["pending", "paid", "cancelled"]),
});

export const invoiceStatusSchema = z.enum(["pending", "paid", "cancelled"]);
