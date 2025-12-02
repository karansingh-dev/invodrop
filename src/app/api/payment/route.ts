import prisma from "@/lib/prisma";
import { ORDER } from "@/types";
import { getUser } from "@/utils/get-user";
import { success } from "zod";

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

    const totalPayments = await prisma.payment.count({
      where: {
        userId: user.id,
      },
    });

    const payments = await prisma.payment.findMany({
      where: {
        userId: user.id,
      },
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            id: true,
            client: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const totalPages = Math.ceil(totalPayments / limit);

    const pagination = {
      total: totalPayments,
      page,
      limit,
      order,
      totalPages,
    };

    return Response.json(
      {
        success: true,
        message: "Payment fetched successfully",
        data: {
          payments,
        },
        pagination,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return;
  }
}
