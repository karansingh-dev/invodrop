import { auth } from "@/lib/auth";
import { User } from "better-auth";
import { headers } from "next/headers";

export const getUser = async (): Promise<null | User> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) return session.user;
  else return null;
};
