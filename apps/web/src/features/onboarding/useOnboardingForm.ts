import { apiRequest } from "@/lib/api";
import { getUploadUrl } from "@/lib/getUploadUrl";
import { uploadFile } from "@/lib/uploadFile";
import { CreateCompanyData, createCompanySchema } from "@repo/shared";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/lib/auth-client";

export const useOnboardingForm = () => {
  const router = useRouter();
  const { refetch } = useSession();

  const { register, reset, watch, setValue, handleSubmit } =
    useForm<CreateCompanyData>({
      resolver: zodResolver(createCompanySchema),
      shouldUnregister: false,

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

  const invoicePrefix = watch("invoicePrefix");
  const logoUrl = watch("logoUrl");
  const country = watch("country");
  const defaultCurrency = watch("defaultCurrency");

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

          reset();
          refetch();
          router.push("/dashboard");
        } else {
          toast.error(response.message || "Something went wrong");
          reset();
        }
      },
    });
  };

  const handleCountry = (value: string) => {
    setValue("country", value);
  };

  const handleCurrency = (value: string) => {
    setValue("defaultCurrency", value);
  };
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const uploadUrl = await getUploadUrl(file.type.split("/")[1]);

      if (!uploadUrl) {
        toast.error("Failed to upload logo, try again");
        return;
      }

      await uploadFile(file, uploadUrl);
      setValue("logoUrl", uploadUrl.split("?")[0]);
      toast.success("Logo Uploaded");
    } catch (error: any) {
      toast.error("Failed to upload logo, try again");
      console.log("Failed upload logo", error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  return {
    register,
    setValue,
    isPending,
    logoUrl,
    handleSubmit,
    handleLogoUpload,
    handleCountry,
    handleCurrency,
    onSubmit,
    currentStep,
    setCurrentStep,
    uploadingImage,
    invoicePrefix,
    country,
    defaultCurrency,
  };
};

export type OnboardingFormType = ReturnType<typeof useOnboardingForm>;
