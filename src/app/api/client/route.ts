import prisma from "@/lib/prisma";
import { createClientSchema } from "@/schema/client";
import { CreateClientDataType, ORDER } from "@/types";
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

    const validation = validateBody<CreateClientDataType>(
      createClientSchema,
      body
    );

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

    const clientExists = await prisma.client.findUnique({
      where: {
        userId_email: {
          email: validation.data.email,
          userId: user.id,
        },
      },
    });

    if (clientExists) {
      return Response.json(
        {
          message: "Client already exists",
          success: false,
          error: "Client Already exists with this email",
        },
        {
          status: 409,
        }
      );
    }

    const newClient = await prisma.client.create({
      data: {
        userId: user.id,
        ...validation.data,
      },
    });

    return Response.json(
      {
        success: true,
        message: "New client created successfully",
        data: {
          ...newClient,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return handleError({
      error,
      message: "Failed to create new client",
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const order = (searchParams.get("order") as ORDER) || ("desc" as ORDER);
    const skip = (page - 1) * limit;

    const totalClients = await prisma.client.count({
      where: {
        userId: user.id,
      },
    });
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        id: user.id,
      },
    });

    const clients = await prisma.client.findMany({
      where: {
        userId: user.id,
      },
      take: limit,
      skip,
      orderBy: {
        createdAt: order,
      },
    });

    const totalPages = Math.ceil(totalClients / limit);

    const pagination = {
      page,
      total: totalClients,
      totalPages,
      limit,
      order,
    };

    return Response.json({
      success: true,
      message: "Clients fetched successfully",
      data: {
        clients,
        currency: userProfile?.currency,
      },
      pagination,
    });
  } catch (error) {
    return handleError({
      error,
      message: "Failed to fetch clients",
      route: req.url,
    });
  }
}
