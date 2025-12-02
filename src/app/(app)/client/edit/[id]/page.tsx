"use client";

import BasicLoader from "@/components/atoms/basic-loader";
import BoxLoader from "@/components/atoms/box-loader";
import { countries } from "@/components/onboarding/step-2";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiRequestClient } from "@/lib/axios";
import { ApiResponse, Client, CreateClientDataType, IdProps } from "@/types";
import clsx from "clsx";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";



interface DataResponse {
  client: Client;
}

export default function Page({ params }: IdProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateClientDataType>({
    defaultValues: {
      country: "IN",
    },
  });

  const fetchClient = async () => {
    try {
      setLoading(true);
      const res = await apiRequestClient<ApiResponse<DataResponse>>(
        "GET",
        `/client/${id}`
      );

      if (res.success) {
        reset({
          name: res.data.client.name,
          contactPerson: res.data.client.contactPerson || "",
          email: res.data.client.email,
          isActive: res.data.client.isActive,
          country: res.data.client.country,
          address: res.data.client.address,
          pincode: res.data.client.pincode,
        });
      } else {
        toast.error("Failed to fetch client");
      }
    } catch {
      toast.error("Failed to fetch client");
    } finally {
      setLoading(false);
    }
  };

  const isActive = watch("isActive");
  const country = watch("country");

  useEffect(() => {
    fetchClient();
  }, []);

  const onSubmit: SubmitHandler<CreateClientDataType> = async (data) => {
    try {
      setUpdating(true);
      const res = await apiRequestClient<ApiResponse>("PUT", `/client/${id}`, {
        data,
      });

      if (res.success) {
        toast.success("Client updated successfully");
        router.push("/client");
      } else {
        console.error("Failed to update client", res.error);
        toast.error("Failed to update client");
      }
    } catch (error) {
      console.error("Failed to update client", error);
      toast.error("Failed to update client");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="w-8 h-8 cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>
          <h2 className="text-2xl font-semibold">Update Client</h2>
        </div>
        <Button
          form="update-client-form"
          disabled={loading}
          type="submit"
          variant="default"
        >
          <Save className="h-4 w-4" />
          {updating ? <BasicLoader /> : "Update Client"}
        </Button>
      </div>
      <div className={clsx(loading && "mx-auto py-30")}>
        {loading ? (
          <BoxLoader />
        ) : (
          <Card className="bg-white w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Client Information</CardTitle>
            </CardHeader>

            <form id="update-client-form" onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="flex flex-col gap-4">
                <div className="space-y-6">
                  <div className="text-xl font-medium">Company Information</div>
                  <div className="flex items-center gap-4">
                    <div className="space-y-1 flex-1">
                      <Label className="font-medium text-md">
                        Company Name
                      </Label>
                      <Input
                        {...register("name", { required: true })}
                        type="text"
                        placeholder="Acme Pvt Ltd"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="font-medium text-md">
                        Contact Person
                      </Label>
                      <Input
                        {...register("contactPerson", { required: true })}
                        type="text"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-xl font-medium">Primary Contact</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="space-y-1 flex-1">
                        <Label className="font-medium text-md">Email</Label>
                        <Input
                          {...register("email", { required: true })}
                          type="text"
                          placeholder="example@company.com"
                        />
                      </div>

                      <div className="space-y-1 flex-1">
                        <Label className="font-medium text-md">Active</Label>
                        <div className="flex items-center gap-2">
                          <Switch
                            defaultChecked={isActive}
                            onCheckedChange={(v) => setValue("isActive", v)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-xl font-medium">Address</div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="font-medium text-md">Country</Label>
                      <Select
                        defaultValue={country || "IN"}
                        onValueChange={(value) => setValue("country", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c, idx) => (
                            <SelectItem key={idx} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="space-y-1 flex-1">
                        <Label className="font-medium text-md">Address</Label>
                        <Input
                          {...register("address", { required: true })}
                          type="text"
                          placeholder="123 Street, City"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label className="font-medium text-md">Pincode</Label>
                        <Input
                          {...register("pincode", { required: true })}
                          type="text"
                          placeholder="000000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </form>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="default"
                className="hover:bg-gray-200 text-black border bg-gray-100"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                form="update-client-form"
                disabled={loading}
                type="submit"
                variant="default"
              >
                <Save className="h-4 w-4" />
                {updating ? <BasicLoader /> : "Update Client"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
