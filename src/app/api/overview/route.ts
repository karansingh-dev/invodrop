import prisma from "@/lib/prisma";
import { calculateChange } from "@/utils/calculate-change";
import { getUser } from "@/utils/get-user";
import { handleError } from "@/utils/handle-error";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized", error: "No session" },
        { status: 403 }
      );
    }

    // dates
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    const prevMonth = subMonths(now, 1);
    const prevMonthStart = startOfMonth(prevMonth);
    const prevMonthEnd = endOfMonth(prevMonth);

    const safeNumber = (v: unknown) => Number(v || 0);
    const safeString = (v: unknown) => String(v || "0");

    // helper: percent + trend

    //  queries
    const [
      thisMonthAgg,
      prevMonthAgg,
      thisMonthCount,
      prevMonthCount,
      statusGroup,
      overdueAgg,
      totalClients,
    ] = await Promise.all([
      prisma.invoice.aggregate({
        where: {
          userId: user.id,
          createdAt: { gte: thisMonthStart, lte: thisMonthEnd },
        },
        _sum: { grandTotal: true },
      }),

      prisma.invoice.aggregate({
        where: {
          userId: user.id,
          createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        _sum: { grandTotal: true },
      }),

      prisma.invoice.count({
        where: {
          userId: user.id,
          createdAt: { gte: thisMonthStart, lte: thisMonthEnd },
        },
      }),

      prisma.invoice.count({
        where: {
          userId: user.id,
          createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
        },
      }),

      prisma.invoice.groupBy({
        by: ["status"],
        where: { userId: user.id },
        _count: { _all: true },
      }),

      prisma.invoice.aggregate({
        where: {
          userId: user.id,
          status: { not: "paid" },
          dueDate: { lt: new Date() },
        },
        _sum: { grandTotal: true },
        _count: { id: true },
      }),

      prisma.client.count({ where: { userId: user.id } }),
    ]);

    // revenue
    const thisRevenue = safeNumber(thisMonthAgg._sum.grandTotal);
    const prevRevenue = safeNumber(prevMonthAgg._sum.grandTotal);
    const revenueChange = calculateChange(thisRevenue, prevRevenue);

    // invoice count trend
    const invoiceChange = calculateChange(thisMonthCount, prevMonthCount);

    // status counts
    const byStatus: Record<string, number> = {
      pending: 0,
      paid: 0,
      cancelled: 0,
    };
    statusGroup.forEach((s) => {
      byStatus[s.status] = s._count._all;
    });

    // overdue trend
    const overdueCurrent = overdueAgg._count?.id || 0;

    // previous overdue
    const prevOverdue = await prisma.invoice.count({
      where: {
        userId: user.id,
        status: { not: "paid" },
        dueDate: { lt: prevMonthEnd },
      },
    });

    const overdueChange = calculateChange(overdueCurrent, prevOverdue);

    return Response.json({
      success: true,
      message: "Overview fetched",
      data: {
        revenue: {
          current: thisRevenue.toFixed(2),
          previous: prevRevenue.toFixed(2),
          ...revenueChange,
        },

        invoices: {
          current: thisMonthCount,
          previous: prevMonthCount,
          ...invoiceChange,

          byStatus,

          overdue: {
            count: overdueCurrent,
            totalAmount: safeString(overdueAgg._sum?.grandTotal),
            ...overdueChange,
          },
        },

        totals: {
          totalClients,
        },
      },
    });
  } catch (error) {
    return handleError({
      error,
      message: "Failed to fetch overview stats",
      route: req.url,
    });
  }
}
