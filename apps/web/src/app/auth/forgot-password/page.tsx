"use client";

import ForgotPasswordForm from "@/features/forgot-password/forgot-password-form";
import ResetPasswordUrlSent from "@/features/forgot-password/reset-password-email";
import { useForgotPasswordForm } from "@/features/forgot-password/useForgotPassword";

export default function ForgotPassword() {
  const forgot = useForgotPasswordForm();

  return (
    <div className="min-h-screen bg-background flex justify-center items-center">
      <main>
        {forgot.emailSent ? (
          <ResetPasswordUrlSent email={forgot.email} />
        ) : (
          <ForgotPasswordForm {...forgot} />
        )}
      </main>
    </div>
  );
}
