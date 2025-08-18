"use client";

import ForgotPasswordForm from "@/features/auth/forgot-password/components/forgot-password-form";
import ResetPasswordUrlSent from "@/features/auth/forgot-password/components/reset-password-email";
import { useForgotPasswordForm } from "@/features/auth/forgot-password/hooks/useForgotPassword";

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
