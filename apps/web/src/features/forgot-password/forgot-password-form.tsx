"use client";

import BasicLoader from "@/components/atoms/basic-loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onZodError } from "@/lib/zod-error-handler";
import {  UseForgotPasswordReturn } from "./useForgotPassword";

export default function ForgotPasswordForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  loading,
}: UseForgotPasswordReturn) {


  return (
    <Card className="w-120">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter the email used for the account. We’ll send a reset password
          link.
        </CardDescription>
      </CardHeader>
      <form id="forgotPassword" onSubmit={handleSubmit(onSubmit, onZodError)}>
        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email
            </Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@example.com"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-rose-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            form="forgotPassword"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-60"
          >
            {loading ? <BasicLoader /> : "Send reset link"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
