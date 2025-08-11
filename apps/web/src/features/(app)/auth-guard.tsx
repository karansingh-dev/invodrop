"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ExtendedUser } from "@/types/better-auth/extendedUser";
import { LoadingScreen } from "@/components/molecules/loading-screen";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session, isPending } = useSession();


    useEffect(() => {

        if (!isPending && !session) {
            router.replace("/auth/login");
        } else if (
            !isPending &&
            session &&
            !(session.user as ExtendedUser).onboardingCompleted
        ) {


            router.replace("/onboarding");
        }
    }, [isPending, session]);


    if (isPending || !session) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}
