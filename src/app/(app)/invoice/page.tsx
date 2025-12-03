"use client";

import BoxLoader from "@/components/atoms/box-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { apiRequestClient } from "@/lib/axios";
import { ApiResponse, InvoiceDataType, InvoiceStatusDataType } from "@/types";
import { downloadPdf } from "@/utils/download-pdf";
import { getCurrencySymbol } from "@/utils/get-currency-symbol";
import { sendPdfToMail } from "@/utils/send-pdf-to-mail";
import clsx from "clsx";
import { format } from "date-fns";
import {
  Check,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface DataResponse {
  invoices: InvoiceDataType[];
  currency: string;
}

type Status = InvoiceStatusDataType | "all" | "overdue";

// badge css
export const statusBadgeClass = (status: Status) => {
  switch (status) {
    case "pending":
      return "bg-amber-200 text-amber-700 border-amber";

    case "paid":
      return "bg-green-200 border-green text-green-700";

    case "cancelled":
      return "bg-gray-300 border-gray text-gray-700";

    case "overdue":
      return "bg-red-200 text-red-700";

    default:
      return "";
  }
};

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceDataType[]>([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<Status>("all");
  const [totalPages, setTotalPages] = useState(1);
  const [currency, setCurrency] = useState("INR");
  const [totalInvoices, setTotalInvoices] = useState<number>(1);
  const limit = 10;

  // fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await apiRequestClient<ApiResponse<DataResponse>>(
        "GET",
        "/invoice",
        {
          params: {
            page,
            limit,
            order: "asc",
          },
        }
      );

      if (res.success) {
        setInvoices(res.data.invoices);
        setCurrency(res.data.currency);
        setTotalInvoices(res.pagination?.total || 1);
        setTotalPages(res.pagination?.totalPages || 1);
      } else {
        toast.error("failed to fetch invoices");
      }
    } catch (error) {
      toast.error("failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id: string) => {
    //    Store previous state to rollback if needed
    const previousInvoices = [...invoices];

    setInvoices((prev) =>
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
      setInvoices(previousInvoices);
    } catch (error) {
      // rollback
      console.error("Failed to mark invoice paid:", error);
      toast.error("Something went wrong. Rolling back changes...");

      setInvoices(previousInvoices);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  // filter + overdue logic
  const filteredInvoices = useMemo(() => {
    if (!invoices?.length) return [];

    const today = new Date();

    return invoices.filter((inv) => {
      const due = new Date(inv.dueDate);
      const isOverdue = due < today && inv.status !== "paid";

      if (status === "all") return true;
      if (status === "overdue") return isOverdue;

      return inv.status === status;
    });
  }, [invoices, status]);

  const tableHeaders = [
    "Invoice",
    "Client",
    "Amount",
    "Issue Date",
    "Due Date",
    "Status",
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <Button
          variant="default"
          onClick={() => router.push("/invoice/create")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* table */}
      <Card className="w-full min-h-120">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">All Invoices</CardTitle>

          <Select
            defaultValue="all"
            onValueChange={(e) => setStatus(e as Status)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="min-h-80">
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
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No invoices found, Try to create New Invoice
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv, idx) => {
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
        <CardFooter className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {invoices.length} of {totalInvoices}
          </div>
          {/* page buttons  */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={loading || page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </Button>

            <span className="text-sm font-medium">
              {page} / {totalPages || 1}
            </span>

            <Button
              variant="outline"
              disabled={loading || page === totalPages}
              onClick={() =>
                setPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
