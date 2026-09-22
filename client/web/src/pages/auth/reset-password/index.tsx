import { FileText, } from "lucide-react"
import { Link } from "react-router-dom"

import BrandPanel from "@/components/auth/brand-panel"
import { cn } from "cn"
import ResetPasswordForm from "@/components/auth/reset-password/reset-password-form"
import { buttonVariants } from "@/components/ui/button"

function ResetPasswordPage() {

  const search = new URLSearchParams(window.location.search)
  const token = search.get("token")
  const error = search.get("error")

  const isInvalidToken = error === "INVALID_TOKEN" || token === "INVALID_TOKEN"
  const isMissingToken = !token && !isInvalidToken

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

          {isInvalidToken || isMissingToken || !token ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-medium tracking-tight">
                  {isInvalidToken ? "Reset link expired" : "Reset link missing"}
                </h1>
                <p className="text-sm text-pretty text-muted-foreground">
                  {isInvalidToken
                    ? "This reset link is invalid or has expired."
                    : "Open the reset link from your email to choose a new password."}
                </p>
              </div>

              <div className="rounded-xl bg-accent px-4 py-3 text-sm leading-6 text-muted-foreground">
                {isInvalidToken
                  ? "Request a new link and try again. Old links only work once and expire after a short time."
                  : "If you do not have a link, request a new one from the forgot password page."}
              </div>

              <Link
                to="/forgot-password"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-10 w-full",
                )}
              >
                Request a new link
              </Link>

              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  to="/sign-in"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <ResetPasswordForm token={token} />
          )}
        </div>
      </section>
    </main>
  )
}

export default ResetPasswordPage
