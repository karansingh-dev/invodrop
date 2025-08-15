import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function useSignOut() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signOut = async () => {
    try {
      setLoading(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            console.log("Sign out successful");
            router.push("/auth/login");
          },
          onError: (error) => {
            console.error("Sign out failed", error);
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading };
}
