"use client";

import BasicLoader from "@/components/atoms/basic-loader";
import OnboardingFormStep1 from "@/components/onboarding/step-1";
import { OnboardingFormStep2 } from "@/components/onboarding/step-2";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { apiRequestClient } from "@/lib/axios";

import { supabase } from "@/lib/supabase/supabase";
import { onboardingSchema } from "@/schema/user";
import { ApiResponse } from "@/types";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export type OnboardingDataType = z.infer<typeof onboardingSchema>;
export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const { refetch } = authClient.useSession();

  const { register, reset, setValue, handleSubmit } =
    useForm<OnboardingDataType>({
      defaultValues: {
        address: "",
        pincode: "",
        logoUrl: "",
        website: "",
        currency: "INR",
        country: "IN",
      },
    });
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // FileList | null
    if (!files || files.length === 0) {
      toast.error("Upload file error");
      return;
    }

    const file = files[0];
    setFile(file);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    handleFileUpload();
  }, [file]);

  const handleFileUpload = async () => {
    try {
      setUploadingImage(true);
      if (!file) {
        toast.error("Please select a file to upload");
        return;
      }

      const fileExtension = file.name.split(".").pop();
      const fileName = `${Math.random()}_${
        file.name.split(".")[0]
      }.${fileExtension}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from(`${process.env.NEXT_PUBLIC_BUCKET_NAME}`)
        .upload(filePath, file);

      if (error) {
        console.error("supabase uploaed failed", error);
        toast.error("Failed to upload image, try again");
      }

      const { data: url } = supabase.storage
        .from(`${process.env.NEXT_PUBLIC_BUCKET_NAME}`)
        .getPublicUrl(filePath);

      setValue("logoUrl", url.publicUrl);
      setFileUploaded(true);
      console.log("file uploaded successfully");
    } catch (error) {
      console.error("Failed to upload Image", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit: SubmitHandler<OnboardingDataType> = async (data) => {
    try {
      setLoading(true);

      const res = await apiRequestClient<ApiResponse>(
        "POST",
        "/user/onboarding",
        {
          data,
        }
      );

      if (res.success) {
        console.log("User onboarded successfully");
        toast.success(res.message || "User Onborded successfully");
        refetch();
      } else {
        console.error("Failed to onboard user", res.error);
        toast.error("Failed to onboard user");
      }
    } catch (error) {
      console.error("failed to call onboard api", error);
      toast.error("Failed to send User details, please try again");
    } finally {
      setLoading(false);
      reset();
    }
  };

  const removeSelectedFile = () => {
    setValue("logoUrl", "");
    setFileUploaded(false);
  };

  const setCurrency = (e: string) => {
    setValue("currency", e);
  };
  const setCountry = (e: string) => {
    setValue("country", e);
  };
  const [step, setStep] = useState<number>(1);
  return (
    <div className="min-h-screen bg-background flex justify-center items-center  ">
      <form id="onboard" onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold ">
              User Details
            </CardTitle>
          </CardHeader>

          <CardContent className="">
            {step === 1 && (
              <OnboardingFormStep1
                removeSelectedFile={removeSelectedFile}
                fileUploaded={fileUploaded}
                uploadingImage={uploadingImage}
                onFileChange={onFileChange}
                setCurrency={setCurrency}
              />
            )}
            {step === 2 && (
              <OnboardingFormStep2
                register={register}
                setCountry={setCountry}
              />
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={step == 1}
              onClick={() => {
                setStep((p) => p - 1);
              }}
            >
              Prev
            </Button>
            {step == 1 && (
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setStep((s) => s + 1);
                }}
              >
                Next
              </Button>
            )}
            {step === 2 && (
              <Button type="submit" form="onboard" variant="default">
                {loading ? <BasicLoader /> : "Finish"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
