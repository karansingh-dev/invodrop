"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BoxLoader from "@/components/atoms/box-loader";

import { apiRequestClient } from "@/lib/axios";
import { ApiResponse, Payments } from "@/types";

import { format } from "date-fns";
import Link from "next/link";
import clsx from "clsx";
import { toast } from "sonner";
import { Eye } from "lucide-react";

interface DataResponse {
  payments: Payments[];
  currency: string;
}

export default function PaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<Payments[]>([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("INR");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  const limit = 8;

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await apiRequestClient<ApiResponse<DataResponse>>(
        "GET",
        "/payment",
        {
          params: {
            page,
            limit,
            order: "desc",
          },
        }
      );

      if (res.success) {
        setPayments(res.data.payments);
        setCurrency(res.data.currency);
        setTotalPayments(res.pagination?.total || 0);
        setTotalPages(res.pagination?.totalPages || 1);
      } else {
        toast.error("Failed to fetch payments");
      }
    } catch (err) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const tableHeaders = ["Invoice", "Client", "Amount", "Method", "Date"];

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payments</h2>
      </div>

      <Card className="w-full min-h-120">
        <CardHeader>
          <CardTitle className="text-lg">All Payments</CardTitle>
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
                <th className="text-left p-2 text-sm text-muted-foreground font-normal">
                  View
                </th>
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
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((pay, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50 border-gray-200"
                  >
                    {/* Invoice */}
                    <td className="p-2">
                      <Link
                        href={`/invoice/${pay.invoice.id}`}
                        className="text-green-600 font-medium hover:underline"
                      >
                        {pay.invoice.invoiceNumber}
                      </Link>
                    </td>

                    {/* Client */}
                    <td className="p-2">{pay.invoice.client.name}</td>

                    {/* Amount */}
                    <td className="p-2 font-medium">
                      {currency} {Number(pay.amount).toFixed(2)}
                    </td>

                    {/* Method */}
                    <td className="p-2 capitalize">{pay.method}</td>

                    {/* Date */}
                    <td className="p-2">
                      {format(new Date(pay.createdAt), "MMM dd, yyyy")}
                    </td>

                    {/* Action */}
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/invoice/${pay.invoice.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {payments.length} of {totalPayments}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </Button>

            <span className="text-sm font-medium">
              {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page === totalPages || loading}
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
