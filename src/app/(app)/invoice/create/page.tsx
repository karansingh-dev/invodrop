"use client";

import BasicLoader from "@/components/atoms/basic-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ArrowLeft, Calendar, Plus, Save, X } from "lucide-react";
import { ApiResponse, Client, NewInvoiceDataType } from "@/types";
import { toast } from "sonner";
import { apiRequestClient } from "@/lib/axios";
import { getCountryNameByCode } from "@/utils/country-state-city";
import { SubmitHandler, useForm } from "react-hook-form";
import { getCurrencySymbol } from "@/utils/get-currency-symbol";

interface DataResponse {
  clients: Client[];
  currency: string;
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedClientEmail, setSelectedClientEmail] = useState<string>("");
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  );

  const [loadingClients, setLoadingClients] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await apiRequestClient<ApiResponse<DataResponse>>(
        "GET",
        "/client",
        { params: { takeAll: true } }
      );

      if (res.success) {
        setClients(res.data.clients);
        setValue("currency", res.data.currency);
      } else {
        toast.error("Failed to load clients");
      }
    } catch (error) {
      toast.error("Failed to load clients");
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const { register, handleSubmit, reset, getValues, watch, setValue } =
    useForm<NewInvoiceDataType>({
      defaultValues: {
        clientEmail: "",
        issueDate,
        dueDate,
        currency: "INR",
        paymentTerm: "Payment is due within 30 days of issue.",
        footerNote: "",
        invoiceItems: [
          {
            name: "",
            description: "",
            quantity: 1,
            unitPrice: 0,
            totalAmount: 0,
          },
        ],
        subTotal: 0,
        taxRate: 0,
        taxAmount: 0,
        grandTotal: 0,
        balanceDue: 0,
      },
    });

  useEffect(() => {
    setValue("issueDate", issueDate!);
  }, [issueDate]);

  useEffect(() => {
    setValue("dueDate", dueDate!);
  }, [dueDate]);

  useEffect(() => {
    setValue("clientEmail", selectedClientEmail || "");
  }, [selectedClientEmail]);

  // line items

  const invoiceItems = watch("invoiceItems") || [];

  const addLineItem = () => {
    const items = [...invoiceItems];
    items.push({
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      taxRate: 0,
      taxAmount: 0,
    });
    setValue("invoiceItems", items);
  };

  const removeLineItem = (index: number) => {
    const items = [...invoiceItems];
    if (items.length <= 1) {
      toast.error("You must have at least one item");
      return;
    }
    items.splice(index, 1);
    setValue("invoiceItems", items);
  };

  const updateLineItemField = (
    index: number,
    field: keyof NewInvoiceDataType["invoiceItems"][number],
    value: any
  ) => {
    const items = [...invoiceItems];
    const updated = { ...items[index], [field]: value };

    const qty = Number(updated.quantity || 0);
    const price = Number(updated.unitPrice || 0);
    updated.totalAmount = qty * price;

    items[index] = updated;
    setValue("invoiceItems", items);
  };

  //   totals
  const subTotal = useMemo(
    () =>
      invoiceItems.reduce(
        (sum, item) => sum + Number(item.totalAmount || 0),
        0
      ),
    [invoiceItems]
  );

  const taxRate = watch("taxRate") || 0;
  const taxAmount = +(subTotal * (Number(taxRate) / 100));
  const grandTotal = +(subTotal + taxAmount);

  useEffect(() => {
    setValue("subTotal", subTotal);
    setValue("taxAmount", taxAmount);
    setValue("grandTotal", grandTotal);
    setValue("balanceDue", grandTotal);
  }, [subTotal, taxAmount, grandTotal]);

  const onSubmit: SubmitHandler<NewInvoiceDataType> = async (data) => {
    try {
      setLoading(true);

      const res = await apiRequestClient<ApiResponse>("POST", "/invoice", {
        data,
      });

      if (res.success) {
        console.log("Invoice created successfully");
        toast.success(res.message || "Invoice created successfully");
        router.push("/invoice");
      } else {
        console.error("Failed to create invoice", res.error);
        toast.error("failed to create invoice , pleae try again");
      }
    } catch (error) {
      console.error("Failed to call create invoice api", error);
      toast.error("Failed to create invoice, please try again");
    } finally {
      reset();
      setLoading(false);
    }
  };

  const currency = watch("currency");

  return (
    <div className="flex flex-col gap-4">
      {/* heading and action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/invoice")}
            variant="ghost"
            className="w-8 h-8 cursor-pointer"
            type="button"
          >
            <ArrowLeft />
          </Button>

          <h2 className="text-2xl font-semibold">Create New Invoice</h2>
        </div>

        <Button type="submit" variant="default" form="invoice-form">
          <Save className="h-4 w-4" />
          {loading ? <BasicLoader /> : " Create Invoice"}
        </Button>
      </div>

      {/* main form */}
      <form
        id="invoice-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid gap-6 grid-cols-2">
          {/* client card  */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* select client */}
                <div className="space-y-1">
                  <Label className="font-medium text-sm">Select Client</Label>

                  <Select
                    value={selectedClientEmail}
                    onValueChange={(e) => setSelectedClientEmail(e)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingClients ? (
                        <SelectItem value="#">Loading...</SelectItem>
                      ) : (
                        clients.map((client, idx) => (
                          <SelectItem key={idx} value={client.email}>
                            {client.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <input {...register("clientEmail")} type="hidden" />
                </div>

                {/* client preview */}
                {selectedClientEmail && (
                  <div className="rounded-lg border p-3 text-sm bg-muted/20">
                    <div className="font-medium">
                      {
                        clients.find((c) => c.email === selectedClientEmail)
                          ?.name
                      }
                    </div>
                    <div className="text-muted-foreground">
                      {
                        clients.find((c) => c.email === selectedClientEmail)
                          ?.email
                      }
                    </div>
                    <div className="text-muted-foreground">
                      {`${
                        clients.find((c) => c.email === selectedClientEmail)
                          ?.address
                      }, ${getCountryNameByCode(
                        clients.find((c) => c.email === selectedClientEmail)
                          ?.country!
                      )}, ${
                        clients.find((c) => c.email === selectedClientEmail)
                          ?.pincode
                      }`}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* date card  */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Details</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* issue date */}
                <div className="space-y-1">
                  <Label>Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {issueDate?.toDateString()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <CalendarComponent
                        mode="single"
                        selected={issueDate}
                        onSelect={(d) => setIssueDate(d)}
                      />
                    </PopoverContent>
                  </Popover>
                  <input {...register("issueDate")} type="hidden" />
                </div>

                {/* due date */}
                <div className="space-y-1">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dueDate?.toDateString()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <CalendarComponent
                        mode="single"
                        selected={dueDate}
                        onSelect={(d) => setDueDate(d)}
                      />
                    </PopoverContent>
                  </Popover>
                  <input {...register("dueDate")} type="hidden" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* line items  */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Line Items</CardTitle>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={addLineItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>

          <CardContent>
            {/* headers */}
            <div className="grid grid-cols-13 gap-4 text-sm font-medium text-muted-foreground px-2">
              <div className="col-span-2">Name *</div>
              <div className="col-span-4">Description </div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-1" />
            </div>

            {/* items */}
            {invoiceItems.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-13 gap-4 items-center py-2"
              >
                {/* name  */}
                <div className="col-span-2">
                  <input
                    className="block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                    value={item.name}
                    placeholder="Name"
                    onChange={(e) =>
                      updateLineItemField(idx, "name", e.target.value)
                    }
                    required
                  />
                  <input
                    {...register(`invoiceItems.${idx}.name` as const)}
                    type="hidden"
                    value={item.name}
                  />
                </div>

                {/* decription  */}
                <div className="col-span-4">
                  <input
                    className="block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                    placeholder="Description "
                    value={item.description || ""}
                    onChange={(e) =>
                      updateLineItemField(idx, "description", e.target.value)
                    }
                  />
                  <input
                    {...register(`invoiceItems.${idx}.description` as const)}
                    type="hidden"
                    value={item.description}
                  />
                </div>
                {/* quantity  */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min={1}
                    className="block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItemField(
                        idx,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                  />
                  <input
                    {...register(`invoiceItems.${idx}.quantity` as const)}
                    type="hidden"
                    value={item.quantity}
                  />
                </div>

                {/* unit price  */}
                <div className="col-span-2">
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    className="block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateLineItemField(
                        idx,
                        "unitPrice",
                        Number(e.target.value)
                      )
                    }
                  />
                  <input
                    {...register(`invoiceItems.${idx}.unitPrice` as const)}
                    type="hidden"
                    value={item.unitPrice}
                  />
                </div>

                {/* total  */}
                <div className="col-span-2">
                  <input
                    readOnly
                    className="block w-full rounded-md border bg-muted/10 px-3 py-2 text-sm"
                    value={Number(item.totalAmount).toFixed(2)}
                  />
                  <input
                    {...register(`invoiceItems.${idx}.totalAmount` as const)}
                    type="hidden"
                    value={item.totalAmount}
                  />
                </div>

                {/* remove.  */}
                <div className="col-span-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeLineItem(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>

          {/* totals  */}
          <div className="p-4 border-t">
            <div className="flex justify-end">
              <div className="space-y-2 w-64">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">{subTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Tax Rate:</span>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    {...register("taxRate")}
                    className="h-8 w-20 rounded-md border bg-transparent px-2 text-sm"
                    value={watch("taxRate")}
                    onChange={(e) =>
                      setValue("taxRate", Number(e.target.value))
                    }
                  />
                </div>

                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span className="font-medium">{taxAmount.toFixed(2)}</span>
                </div>

                <div className="border-t pt-2" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>
                    {getCurrencySymbol(currency)} {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes + terms  */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes & Terms</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="font-medium text-sm">
                Notes (visible to client)
              </Label>
              <textarea
                className="block w-full rounded-md border bg-transparent px-3 py-2 text-sm min-h-[100px]"
                value={watch("footerNote") ?? ""}
                onChange={(e) => setValue("footerNote", e.target.value)}
              />
              <input {...register("footerNote")} type="hidden" />
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-sm">Payment Terms</Label>
              <textarea
                className="block w-full rounded-md border bg-transparent px-3 py-2 text-sm min-h-[100px]"
                value={watch("paymentTerm") ?? ""}
                onChange={(e) => setValue("paymentTerm", e.target.value)}
              />
              <input {...register("paymentTerm")} type="hidden" />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
