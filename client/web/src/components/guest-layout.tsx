import { Navigate, Outlet } from "react-router-dom"

import { authClient } from "@/lib/auth-client"

function GuestLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="min-h-svh bg-background" />
  }

  if (session?.user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default GuestLayout
