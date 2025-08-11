import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export const signOut = async (): Promise<void> => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        console.log("sign out successfull");
        redirect("/auth/login");
      },
      onError: (error) => {
        console.error("Sign out failed", error);
      },
    },
  });
};
