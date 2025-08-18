"use client";
import InvoDropLogo from "@/components/atoms/invodrop-logo";
import TermsAndPolicy from "@/components/atoms/term-policy";
import SignUpForm from "@/features/auth/SignUp/components/signup-form";
import VerifyEmail from "@/features/auth/SignUp/components/verify-email";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUp() {
  const router = useRouter();

  const [verificationRequired, setVerificationRequired] =
    useState<boolean>(false);

  const searchParams = useSearchParams();

  const handleVerification = (): void => {
    setVerificationRequired((prev) => !prev);
  };

  useEffect(() => {
    // clear search params when page is refreshed
    if (searchParams.toString()) {
      router.replace("/auth/signup", { scroll: false });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex justify-center items-center">
      {verificationRequired ? (
        <VerifyEmail onBackToSignUp={handleVerification} />
      ) : (
        <main className="flex justify-center items-center flex-col gap-2 p-8  ">
          <div className="flex items-center justify-center ">
            <InvoDropLogo />
            <h1 className={`text-4xl font-bold tracking-wide`}>InvoDrop</h1>
          </div>

          {/* sign up form  */}
          <SignUpForm onSignUpSuccess={handleVerification} />

          <TermsAndPolicy />
        </main>
      )}
    </div>
  );
}
