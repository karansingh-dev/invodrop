import { Navigate, Outlet } from "react-router-dom"

import { authClient } from "@/lib/auth-client"
import { useBetterAuth } from "@/hooks/better-auth"

function PrivateLayout() {
  const { data: session, isPending } = authClient.useSession()


  if (isPending) {
    return <div className="min-h-svh bg-background" />
  }

  if (!session?.user) {
    return <Navigate to="/sign-in" replace />
  }

  

  return <Outlet />
}

export default PrivateLayout
