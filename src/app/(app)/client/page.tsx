"use client";

import BoxLoader from "@/components/atoms/box-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { ApiResponse, Client, ClientStatus } from "@/types";
import { getCountryNameByCode } from "@/utils/country-state-city";
import { getCurrencySymbol } from "@/utils/get-currency-symbol";
import clsx from "clsx";
import {
  Building,
  CheckCircle,
  Edit,
  FileText,
  Globe,
  Mail,
  MoreHorizontal,
  Plus,
  Trash,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface DataResponse {
  clients: Client[];
  currency: string;
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [currency, setCurrency] = useState<string | null>(null);
  const [status, setStatus] = useState<ClientStatus>("all");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState<number>(0);

  const limit = 8;

  const changeStatus = async (id: string) => {
    const oldStatus = clients.find((c) => c.id === id)?.isActive;

    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    try {
      const res = await apiRequestClient<ApiResponse<DataResponse>>(
        "PATCH",
        `/client/${id}`
      );

      if (res.success) {
        console.log("client status updated successfully");
      } else {
        // rollback on error
        setClients((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: oldStatus! } : c))
        );
        console.error("failed to update client status ", res.error);
        toast.error("Failed to update client status, please try again");
      }
    } catch (error) {
      // rollback on error
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: oldStatus! } : c))
      );
      console.log("Failed to call clients  status api", error);
      toast.error("Failed to update client status, please try again ");
    }
  };

  //   fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await apiRequestClient<ApiResponse<DataResponse>>(
        "GET",
        "/client",
        {
          params: {
            page,
            limit,
            order: "desc",
          },
        }
      );

      if (res.success) {
        console.log("Fetched clients successfully");
        setTotalPages(res.pagination?.totalPages!);

        setClients(res.data.clients);
        setCurrency(res.data.currency);
      } else {
        console.error("failed to fetch clients", res.error);
        toast.error("Failed to fetch clients, please relod page");
      }
    } catch (error) {
      console.log("Failed to call clients api", error);
      toast.error("Failed to fetch clients, please reload the page ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      if (status === "all") return true;
      if (status === "active") return c.isActive;
      if (status === "inactive") return !c.isActive;
    });
  }, [clients, status]);

  return (
    <div className="flex flex-col gap-4 ">
      {/* headings and action buttons  */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold  ">Clients</h2>
        <div>
          <Button
            variant="default"
            onClick={() => {
              router.push("/client/add");
            }}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            Add New Client
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        {/* filter  */}
        <div className="mt-4">
          <Select
            onValueChange={(e) => {
              setStatus(e as ClientStatus);
            }}
            defaultValue="all"
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
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
      </div>

      <div
        className={clsx(
          loading && "flex justify-center  py-25",
          "flex items-center flex-wrap gap-4"
        )}
      >
        {loading ? (
          <BoxLoader />
        ) : (
          filteredClients.map((c, idx) => {
            return (
              <Card className="rounded-md w-[375px]" key={idx}>
                <div className="flex items-center -mt-6 justify-between border-b border-gray-200 bg-slate-100 p-4">
                  <h3 className="tracking-tight font-semibold text-lg">
                    {c.name}
                  </h3>
                  <Badge
                    variant={c.isActive ? "outline" : "secondary"}
                    className={clsx(
                      c.isActive
                        ? "bg-primary/10 border border-primary text-primary "
                        : "bg-slate-200 text-slate-500"
                    )}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardContent className="">
                  <div className="space-y-4 ">
                    <div className="flex gap-2">
                      <Mail className="w-4 h-4" />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{c.email}</p>
                        <p className="text-xs text-slate-500">Email</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Building className="w-4 h-4" />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">
                          {c.address}, {getCountryNameByCode(c.country)},{" "}
                          {c.pincode}
                        </p>
                        <p className="text-xs text-slate-500">Address</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <User className="w-4 h-4" />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{c.contactPerson}</p>
                        <p className="text-xs text-slate-500">
                          Primary Contact{" "}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 border-t border-gray-200  ">
                    <div className="flex items-center justify-between mt-2 ">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">
                          {c.invoiceCount} Invoices
                        </p>
                        <p className="text-slate-500 text-xs">
                          {getCurrencySymbol(currency!)} {c.totalBilledAmount}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {" "}
                          <MoreHorizontal className="h-4 w-4" />{" "}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="font-medium">
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(`/client/edit/${c.id}`);
                            }}
                            className="gap-3"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {" "}
                            <FileText className="h-4 w-4" /> View Invoices
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              changeStatus(c.id);
                            }}
                          >
                            {c.isActive ? (
                              <XCircle className="w-4 h-4 text-rose-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            <span className="">
                              {c.isActive ? "Mark Inactive" : "Mark Active"}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
