import prisma from "@/lib/prisma";
import { createClientSchema } from "@/schema/client";
import { CreateClientDataType, Params } from "@/types";
import { getUser } from "@/utils/get-user";
import { handleError } from "@/utils/handle-error";
import { validateBody } from "@/utils/validate-body";
import { isUUID } from "@/utils/validate-uuid";


export async function PUT(req: Request, { params }: Params) {
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

    const clientExists = await prisma.client.findUnique({
      where: {
        id,
      },
      select: {
        isActive: true,
      },
    });

    if (!clientExists) {
      return Response.json(
        {
          success: false,
          message: "client not found",
          error: "invalid id",
        },
        {
          status: 404,
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

    const updatedClient = await prisma.client.update({
      where: {
        id,
      },
      data: {
        ...validation.data,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Client updated successfully",
        data: updatedClient,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleError({
      error,
      message: "Failed to update client",
      route: req.url,
    });
  }
}

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

    const clientExists = await prisma.client.findUnique({
      where: {
        id,
      },
      select: {
        isActive: true,
      },
    });

    if (!clientExists) {
      return Response.json(
        {
          success: false,
          message: "client not found",
          error: "invalid id",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.client.update({
      where: {
        id,
      },
      data: {
        isActive: !clientExists.isActive,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Client status updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleError({
      error,
      message: "Failed to update client status",
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

    const clientExists = await prisma.client.findUnique({
      where: {
        id,
      },
    });

    if (!clientExists) {
      return Response.json(
        {
          success: false,
          message: "client not found",
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
        message: "Client fetch successfully",
        data: { client: clientExists },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleError({
      error,
      message: "Failed to fetch client",
      route: req.url,
    });
  }
}
