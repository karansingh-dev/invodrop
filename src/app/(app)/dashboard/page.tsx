"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  Plus,
  Check,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BoxLoader from "@/components/atoms/box-loader";

import { apiRequestClient } from "@/lib/axios";
import { ApiResponse, InvoiceDataType } from "@/types";
import { getCurrencySymbol } from "@/utils/get-currency-symbol";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { statusBadgeClass } from "../invoice/page";
import { useRouter } from "next/navigation";
import BasicLoader from "@/components/atoms/basic-loader";
import clsx from "clsx";
import { downloadPdf } from "@/utils/download-pdf";
import { sendPdfToMail } from "@/utils/send-pdf-to-mail";

interface DataResponse {
  invoices: InvoiceDataType[];
  currency: string;
}

interface OverviewResponse {
  revenue: {
    current: string;
    previous: string;
    percentChange: number | null;
    trend: "up" | "down" | "flat" | "na";
  };

  invoices: {
    current: number;
    previous: number;
    percentChange: number | null;
    trend: "up" | "down" | "flat" | "na";
    byStatus: {
      pending?: number;
      paid?: number;
      cancelled?: number;
    };
    overdue: {
      count: number;
      totalAmount: string;
      percentChange: number | null;
      trend: "up" | "down" | "flat" | "na";
    };
  };

  totals: {
    totalClients: number;
  };
}

export default function DashboardMain() {
  const router = useRouter();
  const [recentInvoices, setRecentInvoices] = useState<InvoiceDataType[]>([]);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // fetch overview stats
  const fetchOverview = async () => {
    try {
      setStatsLoading(true);

      const res = await apiRequestClient<ApiResponse<OverviewResponse>>(
        "GET",
        "/overview"
      );

      if (res.success) {
        setOverview(res.data);
      } else {
        toast.error("Failed to fetch stats");
      }
    } catch (err) {
      toast.error("Failed to load stats");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // fetch only 5 invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await apiRequestClient<ApiResponse<DataResponse>>(
        "GET",
        "/invoice",
        {
          params: {
            page: 1,
            limit: 5,
            order: "desc",
          },
        }
      );

      if (res.success) {
        setRecentInvoices(res.data.invoices);
        setCurrency(res.data.currency);
      } else {
        toast.error("Failed to fetch invoices");
      }
    } catch (error) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const tableHeaders = [
    "Invoice",
    "Client",
    "Amount",
    "Issue Date",
    "Due Date",
    "Status",
  ];

  const Trend = ({ trend }: { trend: "up" | "down" | "flat" | "na" }) => {
    if (trend === "up")
      return (
        <span className="flex items-center text-xs text-emerald-500">
          <ArrowUpRight className="mr-1 h-3 w-3" />
          Up
        </span>
      );
    if (trend === "down")
      return (
        <span className="flex items-center text-xs text-rose-500">
          <ArrowDownRight className="mr-1 h-3 w-3" />
          Down
        </span>
      );
    if (trend === "flat")
      return <span className="text-xs text-gray-500">No change</span>;

    return <span className="text-xs text-gray-400">N/A</span>;
  };

  if (statsLoading || loading) {
    return (
      <div className="flex justify-center py-25 items-center">
        <BoxLoader />
      </div>
    );
  }

  const markPaid = async (id: string) => {
    //    Store previous state to rollback if needed
    const previousInvoices = [...recentInvoices];

    setRecentInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    );

    try {
      const res = await apiRequestClient<ApiResponse>(
        "PATCH",
        `/invoice/${id}`,
        {
          data: { status: "paid" },
        }
      );

      if (res.success) {
        console.log("Invoice marked as paid");
        toast.success("Invoice marked as paid");
        return;
      }

      console.error("Failed to mark invoice paid:", res.error);
      toast.error("Failed to update invoice. Rolling back changes...");
      // rollback
      setRecentInvoices(previousInvoices);
    } catch (error) {
      // rollback
      console.error("Failed to mark invoice paid:", error);
      toast.error("Something went wrong. Rolling back changes...");

      setRecentInvoices(previousInvoices);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dashboard title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href={"/invoice/create"}>
          <Button size="sm">
            <Plus className=" h-4 w-4" />
            Create New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading || !overview ? (
              <div className="h-10 flex items-center">
                <BoxLoader />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {getCurrencySymbol(currency)} {overview.revenue.current}
                </div>
                <div className="mt-1">
                  <Trend trend={overview.revenue.trend} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading || !overview ? (
              <div className="h-10 flex items-center">
                <BoxLoader />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {overview.invoices.byStatus.pending || 0}
                </div>
                <div className="mt-1">
                  <Trend trend={overview.invoices.trend} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading || !overview ? (
              <div className="h-10 flex items-center">
                <BoxLoader />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {overview.totals.totalClients}
                </div>
                <div className="mt-1">
                  <Trend trend={overview.invoices.trend} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Invoices  */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={clsx(statsLoading && "flex justify-center items-center")}
          >
            {statsLoading || !overview ? (
              <div className="h-10 flex items-center">
                <BasicLoader color="border-black" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {overview.invoices.current}
                </div>
                <div className="mt-1">
                  <Trend trend={overview.invoices.trend} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Recent Invoices
            </CardTitle>
            <CardDescription>Your latest invoices</CardDescription>
          </div>

          <Link href="/invoice">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="min-h-70">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {tableHeaders.map((th, idx) => (
                  <th
                    key={idx}
                    className="text-left p-2 text-sm text-muted-foreground font-normal"
                  >
                    {th}
                  </th>
                ))}
                <th className="p-2" />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <div className="flex justify-center">
                      <BoxLoader />
                    </div>
                  </td>
                </tr>
              ) : recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No invoices found, Try to create New Invoice
                  </td>
                </tr>
              ) : (
                recentInvoices.map((inv, idx) => {
                  const due = new Date(inv.dueDate);
                  const today = new Date();
                  const isOverdue = due < today && inv.status !== "paid";

                  const displayStatus = isOverdue ? "overdue" : inv.status;

                  return (
                    <tr
                      key={idx}
                      className="border-b hover:bg-gray-50 border-gray-200"
                    >
                      <td className="p-2 font-medium">{inv.invoiceNumber}</td>
                      <td className="p-2">{inv.client?.name}</td>
                      <td className="p-2">
                        {getCurrencySymbol(currency)}

                        {Number(inv.grandTotal).toFixed(2)}
                      </td>
                      <td className="p-2">
                        {format(new Date(inv.issueDate), "MMM dd, yyyy")}
                      </td>
                      <td className="p-2">
                        {format(new Date(inv.dueDate), "MMM dd, yyyy")}
                      </td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className={statusBadgeClass(displayStatus)}
                        >
                          {displayStatus}
                        </Badge>
                      </td>

                      <td className="p-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            className="cursor-pointer"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(`/invoice/${inv.id}`);
                              }}
                            >
                              <Eye className=" h-4 w-4" />
                              view
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={async () => {
                                await downloadPdf(inv.id);
                              }}
                            >
                              <Download className=" h-4 w-4" />
                              download
                            </DropdownMenuItem>

                           
                            <DropdownMenuItem
                              onClick={async () => {
                                await sendPdfToMail(inv.id);
                              }}
                            >
                              <FileText className=" h-4 w-4" />
                              Send Mail
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              disabled={inv.status === "paid"}
                              onClick={() => {
                                markPaid(inv.id);
                              }}
                              className="text-green-600"
                            >
                              <Check className="  h-4 w-4" />
                              Mark Paid
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="min-h-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex  flex-col gap-4">
            <Link href="/invoice/create">
              <Button className="w-full justify-start">
                <Plus className=" h-4 w-4" />
                Create Invoice
              </Button>
            </Link>
            <Link href="/client/add">
              <Button variant="outline" className="w-full justify-start">
                <Users className=" h-4 w-4" />
                Add Client
              </Button>
            </Link>
            {/* <Button variant="outline" className="w-full justify-start">
              <FileText className=" h-4 w-4" />
              Generate Report
            </Button> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
