import { Link } from "react-router-dom"
import { Mail } from "lucide-react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { useBetterAuth } from "@/hooks/better-auth"
import { cn } from "cn"

type CheckEmailPanelProps = {
  email: string
}

function CheckEmailPanel({ email }: CheckEmailPanelProps) {
  const { resendVerification, isResending } = useBetterAuth()

  async function onResend() {
    const res = await resendVerification(email)

    if (!res.ok) {
      toast.error(res.error)
      return
    }

    toast.success("Verification email sent")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Mail className="size-6" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium tracking-tight">Check your email</h1>
        <p className="text-sm leading-6 text-pretty text-muted-foreground">
          We sent a verification link to{" "}
          <span className="font-medium text-foreground break-all">{email}</span>
          . Open it to finish creating your account.
        </p>
      </div>

      <div className="rounded-xl bg-accent px-4 py-3 text-sm leading-6 text-muted-foreground">
        The link expires after a short time. If it is not in your inbox, check
        spam or promotions.
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          size="lg"
          className="h-10 w-full"
          disabled={isResending}
          onClick={onResend}
        >
          {isResending ? "Sending…" : "Resend verification email"}
        </Button>

        <Link
          to="/sign-in"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-10 w-full",
          )}
        >
          I have verified my email
        </Link>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Wrong address?{" "}
        <Link
          to="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign up
        </Link>
      </p>
    </div>
  )
}

export default CheckEmailPanel
