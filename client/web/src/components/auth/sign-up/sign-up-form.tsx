import { useState, type SubmitEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useBetterAuth, type SignUpInput } from "@/hooks/better-auth"

function SignUpForm() {
    const navigate = useNavigate()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [signUpData, setSignUpData] = useState<SignUpInput>({
        email: "",
        password: "",
        name: ""
    })

    const { signUp, isSigningUp } = useBetterAuth()

    async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        const res = await signUp(signUpData)

        if (!res.ok) {
            toast.error(res.error)
            return
        }

        navigate("/check-email", {
            replace: true,
            state: { email: signUpData.email },
        })
    }

    return (
        <>
            <form className="flex flex-col gap-6" onSubmit={onSubmit}>
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-2xl font-medium tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-pretty text-muted-foreground">
                        Enter your details to get started.
                    </p>
                </div>

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Ada Lovelace"
                            autoComplete="name"
                            className="h-10"
                            value={signUpData.name}
                            onChange={(e) => {
                                setSignUpData(prevState => ({
                                    ...prevState,
                                    name: e.target.value
                                }))
                            }}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@studio.com"
                            autoComplete="email"
                            className="h-10"
                            value={signUpData.email}
                            onChange={(e) => {
                                setSignUpData(prevState => ({
                                    ...prevState,
                                    email: e.target.value
                                }))
                            }}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                            <Input
                                id="password"
                                type={isPasswordVisible ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className="h-10 pr-10"
                                value={signUpData.password}
                                onChange={(e) => {
                                    setSignUpData(prevState => ({
                                        ...prevState,
                                        password: e.target.value
                                    }))
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
                </FieldGroup>

                <Button type="submit" size="lg" className="h-10 w-full" disabled={isSigningUp}>
                    {isSigningUp ? "Creating account…" : "Create account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        to="/sign-in"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </>
    )
}

export default SignUpForm
