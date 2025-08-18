"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { onZodError } from "@/lib/zod-error-handler";
import BasicLoader from "@/components/atoms/basic-loader";
import { useOnboardingForm } from "../hooks/useOnboardingForm";
import OnboardingStep1 from "./onboarding-step-1";
import OnboardingStep2 from "./onboarding-step-2";
import OnboardingStep3 from "./onboarding-step-3";
import OnboardingStep4 from "./onboarding-step-4";

export default function OnboardingCarousal() {
  const form = useOnboardingForm();

  return (
    <div>
      <Card className="w-full min-w-120 max-w-120 h-160">
        <CardHeader>
          <CardTitle className="text-2xl">Add Company Details</CardTitle>
        </CardHeader>
        <CardContent className="h-100 flex flex-col gap-4">
          <form
            id="onboardingForm"
            onSubmit={form.handleSubmit(form.onSubmit, onZodError)}
          >
            <div className={form.currentStep === 1 ? "block" : "hidden"}>
              <OnboardingStep1 {...form} />
            </div>
            <div className={form.currentStep === 2 ? "block" : "hidden"}>
              <OnboardingStep2 {...form} />
            </div>

            <div className={form.currentStep === 3 ? "block" : "hidden"}>
              <OnboardingStep3 {...form} />
            </div>
            <div className={form.currentStep === 4 ? "block" : "hidden"}>
              <OnboardingStep4 {...form} />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-8 items-start ">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  form.setCurrentStep(i);
                }}
                className={`h-2 w-8 rounded-full ${
                  form.currentStep === i ? "bg-secondary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between  w-full">
            <Button
              className=" w-20"
              onClick={(e) => {
                e.preventDefault();
                form.setCurrentStep((prev) => prev - 1);
              }}
              disabled={form.currentStep === 1 ? true : false}
            >
              Previous
            </Button>

            {form.currentStep === 4 ? (
              <Button
                form="onboardingForm"
                className="w-20 bg-secondary hover:bg-secondary"
                type="submit"
                disabled={form.currentStep !== 4 ? true : false}
              >
                {form.isPending ? <BasicLoader /> : <p>Finish</p>}
              </Button>
            ) : (
              <Button
                className="w-20"
                onClick={(e) => {
                  e.preventDefault();
                  form.setCurrentStep((prev) => prev + 1);
                }}
                disabled={form.currentStep === 4 ? true : false}
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
