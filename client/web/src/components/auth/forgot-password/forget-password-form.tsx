import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState, type SubmitEvent } from "react"
import { useBetterAuth } from "@/hooks/better-auth"
import { toast } from "sonner"



function ForgotPasswordForm() {

    const [email, setEmail] = useState<string>("");
    const [emailSent, setEmailSent] = useState(false);

    const { isRequestingPasswordReset, requestPasswordReset } = useBetterAuth()

    async function onSubmit(event: SubmitEvent<HTMLFormElement>) {

        event.preventDefault()

        const res = await requestPasswordReset(email);

        if (!res.ok) {
            toast.error(res.error)
            return

        }

        setEmailSent(true);



    }



    return <form
        className="flex flex-col gap-6"
        onSubmit={onSubmit}
    >
        <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-medium tracking-tight">
                {emailSent ? "Email sent successfully" : "Forgot password"}
            </h1>
            <p className="text-sm text-pretty text-muted-foreground">
                {emailSent
                    ? "Check your inbox for a reset link. If it is not there, look in spam."
                    : "Enter the email for your account and we will send a reset link."}
            </p>
        </div>

        {emailSent ? (
            <div className="rounded-xl bg-accent px-4 py-3 text-sm leading-6 text-muted-foreground">
                We sent a reset link to{" "}
                <span className="font-medium text-foreground break-all">{email}</span>.
            </div>
        ) : (
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@studio.com"
                        autoComplete="email"
                        className="h-10"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                </Field>
            </FieldGroup>
        )}

        <Button type="submit" size="lg" className="h-10 w-full">
            {isRequestingPasswordReset
                ? "Sending..."
                : emailSent
                    ? "Send again"
                    : "Send reset link"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
            {emailSent ? "Back to " : "Remember your password? "}
            <Link
                to="/sign-in"
                className="font-medium text-foreground underline-offset-4 hover:underline"
            >
                Sign in
            </Link>
        </p>
    </form>
}


export default ForgotPasswordForm;
