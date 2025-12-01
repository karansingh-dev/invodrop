import { NextResponse } from "next/server";

interface Param {
  error: unknown;
  message: string;
  route: string;
  statusCode?: number;
}

export const handleError = ({
  error,
  message,
  route,
  statusCode = 500,
}: Param) => {
  console.error(message, {
    route,
    error,
  });
  return NextResponse.json(
    { message: "Internal server error", success: false, error: error },
    { status: statusCode }
  );
};