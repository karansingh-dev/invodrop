import { format } from "date-fns";
import prisma from "@/lib/prisma";
import { verifyPdfToken } from "@/utils/pdf-token";

interface PageProps {
  params: Promise<{ id: string; token: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, token } = await params;

  const TokenVerification = verifyPdfToken(token);

  if (!TokenVerification.valid) {
    return (
      <div className="p-10 text-center text-red-500">
        Invalid or expired token
      </div>
    );
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      items: true,
    },
  });

  if (!invoice) {
    return (
      <div className="p-10 text-center text-red-500">Invoice not found</div>
    );
  }

  const formatDate = (d: Date) => format(new Date(d), "MMM dd, yyyy");

  const safe = {
    subTotal: Number(invoice.subTotal ?? 0).toFixed(2),
    taxRate:
      invoice.taxRate !== null ? Number(invoice.taxRate).toString() : null,
    taxAmount:
      invoice.taxAmount !== null ? Number(invoice.taxAmount).toFixed(2) : null,
    grandTotal: Number(invoice.grandTotal ?? 0).toFixed(2),
  };

  return (
    <>
      {/*  CSS to ensure white backgrounds when printing */}
      <style>{`
        @media print {
          /* ensure backgrounds are printed as we expect */
          html, body {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* remove any browser default margins that can show background */
          @page { margin: 20mm; }
        }
      `}</style>
      <div
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",

          boxSizing: "border-box",
        }}
      >
        <div className="p-10 max-w-4xl mx-auto bg-white text-black">
          {/* Header */}
          <header className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
              <p className="text-gray-500 mt-1">#{invoice.invoiceNumber}</p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-lg">{invoice.client.name}</p>
              {invoice.client.email && (
                <p className="text-gray-600">{invoice.client.email}</p>
              )}
              {invoice.client.address && (
                <p className="text-gray-600">{invoice.client.address}</p>
              )}
              <p className="text-gray-600">
                {invoice.client.country}{" "}
                {invoice.client.pincode ? `- ${invoice.client.pincode}` : ""}
              </p>
            </div>
          </header>

          {/* Dates */}
          <section className="grid grid-cols-2 gap-6 mt-6">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500 uppercase">Issue Date</p>
              <p className="font-medium">{formatDate(invoice.issueDate)}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500 uppercase">Due Date</p>
              <p className="font-medium">{formatDate(invoice.dueDate)}</p>
            </div>
          </section>

          {/* Items */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Items</h2>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3 font-medium">Item</th>
                  <th className="p-3 font-medium">Description</th>
                  <th className="p-3 font-medium">Qty</th>
                  <th className="p-3 font-medium">Unit Price</th>
                  <th className="p-3 font-medium text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {invoice.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b text-sm hover:bg-gray-50"
                  >
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-gray-600">
                      {item.description || "-"}
                    </td>
                    <td className="p-3">{String(item.quantity)}</td>
                    <td className="p-3">{Number(item.unitPrice).toFixed(2)}</td>
                    <td className="p-3 text-right font-medium">
                      {Number(item.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Totals */}
          <section className="mt-10 flex justify-end">
            <div className="w-80 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{safe.subTotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Tax ({safe.taxRate ?? 0}%):
                </span>
                <span className="font-medium">
                  {safe.taxAmount ?? Number(0).toFixed(2)}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{safe.grandTotal}</span>
              </div>
            </div>
          </section>

          {/* Notes */}
          {invoice.footerNote ? (
            <section className="mt-10">
              <h2 className="font-semibold mb-2">Notes</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {invoice.footerNote}
              </p>
            </section>
          ) : (
            ""
          )}

          {/* Payment Terms */}

          <section className="mt-8">
            <h2 className="font-semibold mb-2">Payment Terms</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {invoice.paymentTerm}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
