"use client";
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
import { apiRequest } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCompanyData,
  createCompanySchema,
  SUPPORTED_CURRENCIES,
} from "@repo/shared";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SUPPORTED_COUNTRIES } from "@repo/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { onZodError } from "@/lib/zod-error-handler";
import toast from "react-hot-toast";
import { getUploadUrl } from "@/lib/getUploadUrl";
import BasicLoader from "@/components/atoms/basic-loader";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function OnboardingCarousal() {
  const router = useRouter();

  const { register, reset, getValues, setValue, handleSubmit } =
    useForm<CreateCompanyData>({
      resolver: zodResolver(createCompanySchema),
      defaultValues: {
        name: "",
        logoUrl: "",

        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "IN",
        postalCode: "",

        defaultCurrency: "INR",
        invoicePrefix: "INV-",
        defaultInvoiceNote: "Thank you for your business.",
        taxId: "",
        email: "",
        phone: "",
        website: "",
      },
    });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateCompanyData) => {
      return await apiRequest<string, CreateCompanyData>("/user/onboarding", {
        method: "POST",
        data: data,
        protected: true,
      });
    },
  });

  const onSubmit: SubmitHandler<CreateCompanyData> = async (formData) => {
    mutate(formData, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message || "Something went wrong");
        }
      },
    });

    router.push("/dashboard");
  };

  const handleCountry = (value: string) => {
    setValue("country", value);
  };

  const handleCurrency = (value: string) => {
    setValue("defaultCurrency", value);
  };

  const [step, setStep] = useState<number>(1);

  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const uploadUrl = await getUploadUrl(file.type.split("/")[1]);

      if (!uploadUrl) {
        toast.error("Failed to upload logo, try again");
        return;
      }

      await uploadImage(file, uploadUrl);
      setValue("logoUrl", uploadUrl.split("?")[0]);
      toast.success("Logo Uploaded");
    } catch (error: any) {
      toast.error("Failed to upload logo, try again");
      console.log("Failed upload logo", error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadImage = async (file: File, uploadUrl: string) => {
    try {
      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: file,
      });

      if (!res.ok) throw new Error("Failed upload logo");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <div>
      <Card className="w-full min-w-120 max-w-120 h-160">
        <CardHeader>
          <CardTitle className="text-2xl">Add Company Details</CardTitle>
        </CardHeader>
        <CardContent className="h-100 flex flex-col gap-4">
          <form
            id="onboardingForm"
            onSubmit={handleSubmit(onSubmit, onZodError)}
          >
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Company name</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="Acme pvt ltd"
                  />
                </div>

                <div className="grid gap-3">
                  <Label
                    htmlFor="logo"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Upload company logo
                  </Label>

                  <div className="relative group">
                    {/* Main upload area */}
                    <div className="bg-muted/50 flex flex-col justify-center items-center h-40 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-muted/70 transition-all duration-200 cursor-pointer">
                      {uploadingImage ? (
                        <BasicLoader className="text-primary w-8 h-8" />
                      ) : getValues("logoUrl") ? ( // if logoUrl  exists, show success UI
                        <div className="flex flex-col items-center gap-3 text-center p-6">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>

                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Logo uploaded!
                          </p>

                          <button
                            onClick={() => {
                              setValue("logoUrl", "");
                            }}
                            className="px-3 py-1 text-sm rounded-md bg-primary text-white hover:bg-primary/80"
                          >
                            Upload Again
                          </button>
                        </div>
                      ) : (
                        // Original upload UI
                        <div>
                          <div className="flex flex-col items-center gap-3 text-center p-6">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Click to upload
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG up to 5MB
                              </p>
                            </div>
                          </div>

                          <Input
                            disabled={uploadingImage}
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              if (!e.target.files?.[0]) {
                                toast.error("Error uploading file");
                              } else {
                                await handleLogoUpload(e.target.files[0]);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step == 2 && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input
                    {...register("addressLine1")}
                    id="addressLine1"
                    type="text"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    {...register("addressLine2")}
                    id="addressLine2"
                    type="text"
                  />
                </div>

                <div className="flex justify-between">
                  <div className="grid gap-3">
                    <Label htmlFor="state">State</Label>
                    <Input {...register("state")} id="state" type="text" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="city">City</Label>
                    <Input {...register("city")} id="city" type="text" />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    {...register("postalCode")}
                    id="postalCode"
                    type="text"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="country">Country</Label>

                  <Select
                    defaultValue={getValues("country")}
                    onValueChange={(e) => {
                      handleCountry(e);
                    }}
                  >
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_COUNTRIES.map((country) => {
                        return (
                          <SelectItem key={country.name} value={country.code}>
                            {country.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Label>Default Currency</Label>
                  <Select
                    defaultValue={getValues("defaultCurrency")}
                    onValueChange={(e) => {
                      handleCurrency(e);
                    }}
                  >
                    <SelectTrigger id="defaultCurrency" className="w-full">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_CURRENCIES.map((currency) => {
                        return (
                          <SelectItem key={currency.name} value={currency.code}>
                            {currency.name} ({currency.symbol})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    {...register("invoicePrefix")}
                    value={getValues("invoicePrefix")}
                    type="text"
                    id="invoicePrefix"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="taxId">
                    Tax Id{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    {...register("taxId")}
                    type="text"
                    id="taxId"
                    placeholder="Gst number, Vat etc"
                  />
                  <p className="text-sm text-muted-foreground">
                    If your business is registered for taxes, enter your
                    registration number (GST, VAT, EIN, etc.){" "}
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="defaultInvoiceNote">
                    Default Invoice Note
                  </Label>
                  <Textarea
                    {...register("defaultInvoiceNote")}
                    id="defaultInvoiceNote"
                    className="h-20"
                    placeholder="Type your message here."
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    type="email"
                    id="email"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    {...register("website")}
                    type="text"
                    id="wesbite"
                    placeholder="Enter you website url"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    {...register("phone")}
                    type="text"
                    id="phone"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-8 items-start ">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setStep(i);
                }}
                className={`h-2 w-8 rounded-full ${
                  step === i ? "bg-secondary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between  w-full">
            <Button
              className=" w-20"
              onClick={(e) => {
                e.preventDefault();
                setStep((prev) => prev - 1);
              }}
              disabled={step === 1 ? true : false}
            >
              Previous
            </Button>

            {step === 4 ? (
              <Button
                form="onboardingForm"
                className="w-20 bg-secondary hover:bg-secondary"
                type="submit"
                disabled={step !== 4 ? true : false}
              >
                {isPending ? <BasicLoader /> : <p>Finish</p>}
              </Button>
            ) : (
              <Button
                className="w-20"
                onClick={(e) => {
                  e.preventDefault();
                  setStep((prev) => prev + 1);
                }}
                disabled={step === 4 ? true : false}
              >
                Next
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
