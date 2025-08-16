"use client";

import BasicLoader from "@/components/atoms/basic-loader";
import SuccessCheck from "@/components/atoms/success-check";
import Link from "next/link";

export default function ResetPasswordUrlSent({ email }: { email: string }) {
  return (
    <div className="space-y-8 w-full max-w-md mx-auto text-center ">
      <SuccessCheck />

      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password Email Sent Successfully!
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We sent a password reset link to your email address
        </p>
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-1">
          Reset Passowrd email sent to:
        </p>
        {email ? (
          <p className="font-medium text-sm">{email} </p>
        ) : (
          <BasicLoader />
        )}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Click the link in your email to reset your password. The link will
        expire in 1 hour.
      </p>

      <div className="pt-4 border-t border-border/50">
        <Link
          href="/auth/login"
          className="text-primary hover:underline font-medium transition-colors text-sm"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
