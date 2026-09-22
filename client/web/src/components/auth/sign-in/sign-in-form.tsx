import { useState, type SubmitEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { type SingInInput, useBetterAuth } from "@/hooks/better-auth"
import { toast } from "sonner"


function SingInForm() {

    const navigate = useNavigate();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [signInDate, setSignInData] = useState<SingInInput>({
        email: "",
        password: ""
    })


    const { isSigningIn, signIn } = useBetterAuth()


    async function onSubmit(event: SubmitEvent<HTMLFormElement>) {

        event.preventDefault()

        const res = await signIn(signInDate)

        if (!res.ok) {
            if (res.code === "EMAIL_NOT_VERIFIED") {
                toast.error("Verify your email before signing in")
                navigate("/check-email", {
                    replace: true,
                    state: { email: signInDate.email },
                })
                return
            }

            toast.error(res.error)
            return
        }

        navigate("/dashboard", {
            replace: true,
        })
    }

    return <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-medium tracking-tight">
                Welcome back
            </h1>
            <p className="text-sm text-pretty text-muted-foreground">
                Sign in to continue to your workspace.
            </p>
        </div>

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
                    value={signInDate.email}
                    onChange={(e) => {
                        setSignInData(prevState => ({
                            ...prevState,
                            email: e.target.value
                        }))
                    }}
                />
            </Field>
            <Field>
                <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                        to="/forgot-password"
                        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-10 pr-10"
                        value={signInDate.password}
                        onChange={(e) => {
                            setSignInData(prevState => ({
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

        <Button type="submit" size="lg" className="h-10 w-full">
            {isSigningIn ? "Signing In" : "Sign In"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
                to="/sign-up"
                className="font-medium text-foreground underline-offset-4 hover:underline"
            >
                Sign up
            </Link>
        </p>
    </form>
}

export default SingInForm;