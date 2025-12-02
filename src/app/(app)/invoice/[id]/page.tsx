"use client";

import React, { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
} from "lucide-react";

import Link from "next/link";
import { format } from "date-fns";
import { ApiResponse, IdProps } from "@/types";
import { toast } from "sonner";
import { apiRequestClient } from "@/lib/axios";
import { getCurrencySymbol } from "@/utils/get-currency-symbol";
import BoxLoader from "@/components/atoms/box-loader";

interface Invoice {
  status: string;
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  taxRate: string | null;
  currency: string;
  paymentTerm: string;
  subTotal: string;
  taxAmount: string | null;
  grandTotal: string;
  balanceDue: string;
  footerNote: string | null;

  items: {
    id: string;
    name: string;
    description: string | null;
    unitPrice: string;
    quantity: string;
    totalAmount: string;
  }[];

  client: {
    id: string;
    email: string;
    name: string;
    country: string;
    address: string;
    pincode: string;
    contactPerson: string | null;
  };
}

interface DataResponse {
  invoice: Invoice;
}

export default function InvoiceDetailPage({ params }: IdProps) {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const fetchInvoice = async () => {
    try {
      setLoading(true);

      const res = await apiRequestClient<ApiResponse<DataResponse>>(
        "GET",
        `/invoice/${id}`
      );

      if (res.success) {
        setInvoice(res.data.invoice);
      } else {
        toast.error("Failed to load invoice, please reload page");
      }
    } catch (error) {
      toast.error("Failed to load invoice, please reload page ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const getBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
            <CheckCircle className="w-3 h-3 mr-1" /> Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-700 border border-red-200 shadow-sm">
            <AlertCircle className="w-3 h-3 mr-1" /> Overdue
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!invoice)
    return (
      <div className="py-32 flex justify-center items-center">
        <BoxLoader />
      </div>
    );

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link href="/invoice">
            <Button variant="outline" size="icon" className="rounded-md">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-semibold leading-tight">
              Invoice #{invoice.invoiceNumber}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-sm">
              {getBadge(invoice.status)}
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Due {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Main */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border border-border/50">
            <CardContent className="p-10">
              {/* Header */}
              <div className="flex justify-between mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-md bg-primary p-2 shadow-sm">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold">InvoiceDrop</h2>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">
                      {invoice.client.name}
                    </p>
                    <p>{invoice.client.address}</p>
                    <p>
                      {invoice.client.country} — {invoice.client.pincode}
                    </p>
                    <p className="pt-1">{invoice.client.email}</p>
                  </div>
                </div>

                <div className="text-right text-sm space-y-1 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">
                      Issue Date:
                    </span>{" "}
                    {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Due Date:
                    </span>{" "}
                    {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden bg-card">
                <div className="bg-muted/30 px-5 py-3 border-b text-sm font-medium text-muted-foreground">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                </div>

                {invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="px-5 py-4 border-b last:border-none text-sm hover:bg-muted/10 transition"
                  >
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6 font-medium text-foreground">
                        {item.name}
                      </div>
                      <div className="col-span-2 text-center text-muted-foreground">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-right text-muted-foreground">
                        {getCurrencySymbol(invoice.currency)} {item.unitPrice}
                      </div>
                      <div className="col-span-2 text-right font-semibold text-foreground">
                        {getCurrencySymbol(invoice.currency)} {item.totalAmount}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 pl-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex justify-end mt-10">
                <div className="w-72 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {getCurrencySymbol(invoice.currency)} {invoice.subTotal}
                    </span>
                  </div>

                  {invoice.taxRate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tax ({invoice.taxRate}%)
                      </span>
                      <span className="font-medium">
                        {getCurrencySymbol(invoice.currency)}{" "}
                        {invoice.taxAmount}
                      </span>
                    </div>
                  )}

                  <Separator className="my-3" />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>
                      {getCurrencySymbol(invoice.currency)} {invoice.grandTotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Balance Due</span>
                    <span className="font-semibold text-foreground">
                      {getCurrencySymbol(invoice.currency)} {invoice.balanceDue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.footerNote && (
                <div className="mt-10">
                  <h4 className="font-semibold mb-2">Additional Notes</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {invoice.footerNote}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card className="shadow-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p className="font-medium">{invoice.client.name}</p>
              <p className="text-muted-foreground">{invoice.client.email}</p>
              <p className="text-muted-foreground leading-relaxed">
                {invoice.client.address}, {invoice.client.country},
                {invoice.client.pincode}
              </p>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="shadow-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground mb-1">Total</p>
                <p className="text-xl font-semibold">
                  {getCurrencySymbol(invoice.currency)} {invoice.grandTotal}
                </p>
              </div>

              <div>
                <p className="font-medium text-muted-foreground mb-1">
                  Balance Due
                </p>
                <p className="text-lg font-semibold">
                  {getCurrencySymbol(invoice.currency)} {invoice.balanceDue}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
