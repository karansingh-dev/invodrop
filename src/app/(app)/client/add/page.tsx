"use client";

import BasicLoader from "@/components/atoms/basic-loader";
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
import { ApiResponse, CreateClientDataType } from "@/types";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateClientDataType>({
    defaultValues: {
      isActive: true,
      country: "IN",
    },
  });

  const onSubmit: SubmitHandler<CreateClientDataType> = async (data) => {
    try {
      setLoading(true);
      const res = await apiRequestClient<ApiResponse>("POST", "/client", {
        data,
      });

      if (res.success) {
        console.log("New client created successfully");
        router.push("/client");
        toast.success(res.message || "Client created successfully");
      } else {
        console.error("Failed to create new client", res.error);
        console.log(res.message);
        if (res.message === "Client already exists") {
          toast.error(res.message);
        } else {
          toast.error("Failed to create new client");
        }
      }
    } catch (error) {
      console.error("Failed to call create client api", error);
      toast.error("Failed to create new client");
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 ">
      {/* heading and action buttons  */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="w-8 h-8 cursor-pointer">
            <ArrowLeft />
          </Button>

          <h2 className="text-2xl font-semibold">Add New Client </h2>
        </div>
        <div>
          <Button
            form="create-client-form"
            disabled={loading}
            type="submit"
            variant="default"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? <BasicLoader /> : " Save Client"}
          </Button>
        </div>
      </div>

      <Card className="bg-white w-4xl mx-auto ">
        <CardHeader>
          <CardTitle className="text-2xl ">Client Information</CardTitle>
        </CardHeader>

        <form id="create-client-form" onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            {/* company information  */}
            <div className="space-y-6">
              <div className="text-xl font-medium ">Company Information</div>
              <div className="flex items-center gap-4">
                <div className="space-y-1 flex-1">
                  <Label className="font-medium text-md">Company Name</Label>
                  <Input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="Acme Pvt Ltd"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="font-medium text-md">Contact Person</Label>
                  <Input
                    {...register("contactPerson", { required: true })}
                    type="text"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>

            {/* Primary contact  */}
            <div className="space-y-6">
              <div className="text-xl font-medium ">Primary Contact</div>
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
                        defaultChecked
                        onCheckedChange={(v) => setValue("isActive", v)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address  */}
            <div className="space-y-6">
              <div className="text-xl font-medium ">Address</div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="font-medium text-md">Country</Label>
                  <Select
                    defaultValue="IN"
                    onValueChange={(value) => setValue("country", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c, idx) => {
                        return (
                          <SelectItem key={idx} value={c.code}>
                            {c.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* address  */}
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
          >
            Cancel
          </Button>
          <Button
            form="create-client-form"
            disabled={loading}
            type="submit"
            variant="default"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? <BasicLoader /> : " Save Client"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
