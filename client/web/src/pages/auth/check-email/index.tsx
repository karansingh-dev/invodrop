import { FileText } from "lucide-react"
import { Navigate, useLocation } from "react-router-dom"

import BrandPanel from "@/components/auth/brand-panel"
import CheckEmailPanel from "@/components/auth/check-email/check-email-panel"

type CheckEmailState = {
  email?: string
}

function CheckEmailPage() {
  const location = useLocation()
  const email = (location.state as CheckEmailState | null)?.email?.trim() ?? ""

  if (!email) {
    return <Navigate to="/sign-up" replace />
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <BrandPanel />

      <section className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="size-4" />
            </div>
            <span className="text-sm font-medium tracking-tight">Invodrop</span>
          </div>

          <CheckEmailPanel email={email} />
        </div>
      </section>
    </main>
  )
}

export default CheckEmailPage
