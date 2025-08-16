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
import { Eye, EyeOffIcon } from "lucide-react";
import { useResetPasswordForm } from "./useResetPasswordForm";

export default function ResetPasswordForm() {
  const {
    hasError,
    register,
    passwordVisible,
    setPasswordVisible,
    handleSubmit,
    errors,
    loading,
    onSubmit,
  } = useResetPasswordForm();

  if (hasError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">Invalid or expired reset link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex justify-center items-center">
      <main>
        <Card className="w-120">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your new password below.</CardDescription>
          </CardHeader>

          <form
            id="resetPassword"
            onSubmit={handleSubmit(onSubmit, onZodError)}
          >
            <div className="px-6 pb-6 space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="newPassword">New Password</Label>

                <div className="relative">
                  <Input
                    {...register("newPassword")}
                    id="newPassword"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="new password"
                  />
                  <button
                    className="absolute right-3 top-3"
                    onClick={(e) => {
                      e.preventDefault();
                      setPasswordVisible(!passwordVisible);
                    }}
                  >
                    {passwordVisible ? (
                      <Eye className=" text-balck h-4 w-4" />
                    ) : (
                      <EyeOffIcon className=" text-balck h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-rose-300 ">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                form="resetPassword"
                className="w-full inline-flex items-center justify-center"
              >
                {loading ? <BasicLoader /> : "Reset Password"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
