import prisma from "@/lib/prisma";
import { invoiceStatusSchema } from "@/schema/invoice";
import { Params, InvoiceStatusDataType } from "@/types";
import { getUser } from "@/utils/get-user";
import { handleError } from "@/utils/handle-error";
import { validateBody } from "@/utils/validate-body";
import { isUUID } from "@/utils/validate-uuid";



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
    const validation = validateBody<InvoiceStatusDataType>(
      invoiceStatusSchema,
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

    await prisma.invoice.update({
      where: {
        id,
      },
      data: {
        status: validation.data,
      },
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
