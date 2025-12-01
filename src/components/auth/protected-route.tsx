"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/molecules/loading-screen";
import { authClient } from "@/lib/auth-client";

export type ExtendedUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
  role: "admin" | "user";
  isOnboarded: boolean;
};

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    } else if (
      !isPending &&
      session &&
      !(session.user as ExtendedUser).isOnboarded
    ) {
      if (!pathname.includes("onboarding")) {
        router.replace("/onboarding");
      }
    } else {
      if (pathname.includes("onboarding")) {
        router.replace("/dashboard");
      } 
    }
  }, [isPending, session]);

  if (isPending || !session) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
