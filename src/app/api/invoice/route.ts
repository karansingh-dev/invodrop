import { Invoice } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { newInvoiceSchema } from "@/schema/invoice";
import { NewInvoiceDataType, ORDER } from "@/types";
import { getUser } from "@/utils/get-user";
import { handleError } from "@/utils/handle-error";
import { validateBody } from "@/utils/validate-body";

export async function POST(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Forbidden", error: "No user session" },
        {
          status: 403,
        }
      );
    }

    const body = await req.json();
    //     console.log(body);

    //    return Response.json({success:true});

    const validation = validateBody<NewInvoiceDataType>(newInvoiceSchema, body);

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

    const client = await prisma.client.findUnique({
      where: {
        userId_email: {
          email: validation.data.clientEmail,
          userId: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!client) {
      return Response.json(
        {
          success: false,
          message: "client not found",
          error: "invalid Client email",
        },
        {
          status: 404,
        }
      );
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userProfile) {
      return Response.json(
        {
          success: false,
          message: "UserProfile not found",
          error: "profile not found",
        },
        {
          status: 404,
        }
      );
    }

    const data = validation.data;
    const invoiceNumber = `INV-${userProfile.invoiceCount}`;

    const newInvoiceData = {
      invoiceNumber,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      currency: data.currency,
      paymentTerm: data.paymentTerm,
      subTotal: data.subTotal,
      taxAmount: data.taxAmount,
      grandTotal: data.grandTotal,
      balanceDue: data.balanceDue,
      footerNote: data.footerNote,
      taxRate: data.taxRate,
    };

    let newInvoice!: Invoice;

    await prisma.$transaction(async (tsx) => {
      newInvoice = await tsx.invoice.create({
        data: {
          userId: user.id,
          clientId: client.id,
          ...newInvoiceData,
        },
      });

      const invoiceItems = validation.data.invoiceItems.map((i) => {
        return {
          invoiceId: newInvoice.id,
          name: i.name,
          description: i.description,

          unitPrice: i.unitPrice,
          totalAmount: i.totalAmount,
          taxAmount: i.taxAmount,
          taxRate: i.taxRate,
          quantity: i.quantity,
        };
      });

      await tsx.invoiceItem.createMany({
        data: invoiceItems,
      });

      await tsx.client.update({
        where: {
          id: client.id,
        },
        data: {
          invoiceCount: { increment: 1 },
          totalBilledAmount: { increment: validation.data.grandTotal },
        },
      });

      await tsx.userProfile.update({
        where: {
          id: userProfile.id,
        },
        data: {
          invoiceCount: { increment: 1 },
        },
      });
    });

    return Response.json(
      {
        message: "Invoice created successfully",
        success: true,
        data: {
          invoice: newInvoice,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return handleError({
      error,
      message: "Failed to create invoice",
      route: req.url,
    });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized", error: "Unauthorized" },
        {
          status: 403,
        }
      );
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userProfile) {
      return Response.json(
        {
          success: false,
          message: "profile not found",
          error: "user profile does not exists",
        },
        {
          status: 404,
        }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const order = (searchParams.get("order") as ORDER) || ("desc" as ORDER);
    const skip = (page - 1) * limit;

    const totalInvoices = await prisma.invoice.count({
      where: {
        userId: user.id,
      },
    });

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
      },
      include: {
        client: true,
      },
      take: limit,
      skip,
      orderBy: {
        createdAt: order,
      },
    });
    const totalPages = Math.ceil(totalInvoices / limit);

    const pagination = {
      totalPages,
      total: totalInvoices,
      page,
      limit,
      order,
    };

    return Response.json({
      success: true,
      message: "Invoices fetched successfully",
      data: {
        invoices,
        currency: userProfile.currency,
      },
      pagination,
    });
  } catch (error) {
    return handleError({
      error,
      message: "Failed to fetch invoices",
      route: req.url,
    });
  }
}
