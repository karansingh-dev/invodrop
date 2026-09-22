import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState, type SubmitEvent } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useBetterAuth } from "@/hooks/better-auth"
import { toast } from "sonner"


function ResetPasswordForm({ token }: { token: string }) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [passwordMatch, setPasswordMatch] = useState<boolean>(true);



    const navigate = useNavigate()
    const { resetPassword, resettingPassword } = useBetterAuth()


    async function onSubmit(event: SubmitEvent<HTMLFormElement>) {

        event.preventDefault();

        if (password != confirmPassword) {
            setPasswordMatch(false);
            return
        }

        setPasswordMatch(true);


        const res = await resetPassword(password, token);

        if (!res.ok) {
            toast.error(res.error)
            return
        }

        toast.success("Password reset")
        navigate("/sign-in", { replace: true })

    }



    return <form
        className="flex flex-col gap-6"
        onSubmit={onSubmit}
    >
        <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-medium tracking-tight">
                Reset password
            </h1>
            <p className="text-sm text-pretty text-muted-foreground">
                Choose a new password for your account.
            </p>
        </div>

        <FieldGroup>
            <Field>
                <FieldLabel htmlFor="password">New password</FieldLabel>
                <div className="relative">
                    <Input
                        id="password"
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-10 pr-10"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordMatch(true);
                        }}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                        aria-pressed={isPasswordVisible}
                        onClick={() => setIsPasswordVisible((visible) => !visible)}
                    >
                        {isPasswordVisible ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
            </Field>
            <Field data-invalid={!passwordMatch || undefined}>
                <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
                <div className="relative">
                    <Input
                        id="confirm-password"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-10 pr-10"
                        value={confirmPassword}
                        aria-invalid={!passwordMatch}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordMatch(true);
                        }}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
                        aria-label={
                            isConfirmPasswordVisible
                                ? "Hide confirm password"
                                : "Show confirm password"
                        }
                        aria-pressed={isConfirmPasswordVisible}
                        onClick={() =>
                            setIsConfirmPasswordVisible((visible) => !visible)
                        }
                    >
                        {isConfirmPasswordVisible ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
                {!passwordMatch && (
                    <FieldError>Passwords do not match.</FieldError>
                )}
            </Field>
        </FieldGroup>

        <Button type="submit" size="lg" className="h-10 w-full">
            {resettingPassword ? "Resetting…" : "Reset password"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
                to="/sign-in"
                className="font-medium text-foreground underline-offset-4 hover:underline"
            >
                Sign in
            </Link>
        </p>
    </form>
}

export default ResetPasswordForm;