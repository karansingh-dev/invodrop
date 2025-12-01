"use client";

import Logo from "@/components/atoms/logo";
import { LoginForm } from "@/components/auth/login-form";


export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col gap-6 items-stretch">
        {/* Brand header */}
        <div className="flex items-center gap-3 justify-center mb-2">
          <Logo />
          <div className="flex flex-col">
            <h1 className="text-3xl bbh-sans-hegarty text-gray-600 tracking-tight leading-tight">
              InvoDrop
            </h1>
            <p className="text-sm text-muted-foreground">
              Smart invoicing made simple
            </p>
          </div>
        </div>

        {/* Login card */}
        <LoginForm />
      </div>
    </div>
  );
}
