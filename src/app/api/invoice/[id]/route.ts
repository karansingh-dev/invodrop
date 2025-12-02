import prisma from "@/lib/prisma";
import { invoiceStatusSchemaForApi } from "@/schema/invoice";
import { Params, InvoiceStatusDataType } from "@/types";
import { getUser } from "@/utils/get-user";
import { handleError } from "@/utils/handle-error";
import { validateBody } from "@/utils/validate-body";
import { isUUID } from "@/utils/validate-uuid";
import z from "zod";

type StatusDateTypeForApi = z.infer<typeof invoiceStatusSchemaForApi>;

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    if (!isUUID(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid Id ",
          error: "Invalid paramters sent in the url",
        },
        {
          status: 400,
        }
      );
    }

    const user = await getUser();

    if (!user) {
      return Response.json(
        { message: "Forbidden", success: false, error: "Unauthorized" },
        {
          status: 403,
        }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
      },
    });

    if (!invoice) {
      return Response.json(
        {
          success: false,
          message: "Invoice not found",
          error: "invalid id",
        },
        {
          status: 404,
        }
      );
    }

    const body = await req.json();
    const validation = validateBody<StatusDateTypeForApi>(
      invoiceStatusSchemaForApi,
      body
    );

    if (!validation.success) {
      if (!validation.success) {
        return Response.json(
          {
            success: false,
            message: "Body validation failed",
            error: validation.error,
          },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      //    Update invoice status
      const updatedInvoice = await tx.invoice.update({
        where: { id },
        data: {
          status: validation.data.status,
          paidAt: validation.data.status === "paid" ? new Date() : null,
        },
      });

      //  create payment only  if status is "paid"
      let payment = null;

      if (validation.data.status === "paid") {
        payment = await tx.payment.create({
          data: {
            invoiceId: updatedInvoice.id,
            userId: user.id,
            amount: updatedInvoice.grandTotal,
            method: "manual",
          },
        });
      }
    });

    return Response.json(
      { success: true, message: "Invoice status updated successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleError({
      error,
      message: "Failed to update change status of invoice",
      route: req.url,
    });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    if (!isUUID(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid Id ",
          error: "Invalid paramters sent in the url",
        },
        {
          status: 400,
        }
      );
    }

    const user = await getUser();

    if (!user) {
      return Response.json(
        { message: "Forbidden", success: false, error: "Unauthorized" },
        {
          status: 403,
        }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
      },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      return Response.json(
        {
          success: false,
          message: "Invoice not found",
          error: "invalid id",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Invoice  fetched successfully",
        data: {
          invoice,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleError({
      error,
      message: "Failed to fetch invoice",
      route: req.url,
    });
  }
}
