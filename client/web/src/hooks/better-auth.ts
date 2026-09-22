import { useState } from "react"

import { authClient } from "@/lib/auth-client"
import { useNavigate } from "react-router-dom"

type SignUpInput = {
    email: string
    password: string
    name: string
}

type SingInInput = {
    email: string
    password: string
}

type SignUpResult = { ok: true } | { ok: false; error: string; code?: string }

function useBetterAuth() {

    const navigate = useNavigate();
    const [isSigningUp, setIsSigningUp] = useState(false)


    const signUp = async (user: SignUpInput): Promise<SignUpResult> => {
        setIsSigningUp(true)

        try {
            const { error } = await authClient.signUp.email({
                email: user.email,
                password: user.password,
                name: user.name,
                callbackURL: `${window.location.origin}/sign-in`,
            })

            if (error) {
                return { ok: false, error: error.message || "Failed to create user" }
            }
            return { ok: true }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to create user"
            return { ok: false, error: message }
        } finally {
            setIsSigningUp(false)
        }
    }

    const [isResending, setIsResending] = useState(false)

    const resendVerification = async (email: string): Promise<SignUpResult> => {
        setIsResending(true)

        try {
            const { error } = await authClient.sendVerificationEmail({
                email,
                callbackURL: `${window.location.origin}/sign-in`,
            })

            if (error) {
                return {
                    ok: false,
                    error: error.message || "Failed to resend verification email",
                }
            }

            return { ok: true }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to resend verification email"
            return { ok: false, error: message }
        } finally {
            setIsResending(false)
        }
    }

    const [isSigningIn, setIsSigningIn] = useState(false);

    const signIn = async (user: SingInInput): Promise<SignUpResult> => {


        setIsSigningIn(true);
        try {
            const { error } = await authClient.signIn.email({
                email: user.email,
                password: user.password,
                callbackURL: `${window.location.origin}/sign-in`,
            })

            if (error) {
                return {
                    ok: false,
                    error: error.message || "Failed to SignIn",
                    code: error.code,
                }
            }

            return { ok: true }

        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to SignIn"
            return { ok: false, error: message }

        } finally {
            setIsSigningIn(false);
        }
    }

    const [isRequestingPasswordReset, setRequestingPasswordReset] = useState(false);

    const requestPasswordReset = async (email: string): Promise<SignUpResult> => {

        setRequestingPasswordReset(true);
        try {
            const { data, error } = await authClient.requestPasswordReset({
                email,
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                return { ok: false, error: error.message || "Failed to sent reset password link" }
            }

            return {
                ok: true
            }

        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to SignIn"
            return { ok: false, error: message }

        }
        finally {
            setRequestingPasswordReset(false);
        }

    }

    const [resettingPassword, setResettingPassword] = useState<boolean>(false);

    const resetPassword = async (newPassword: string, token: string): Promise<SignUpResult> => {

        setResettingPassword(true)

        try {

            const { data, error } = await authClient.resetPassword({ token, newPassword });

            if (error) {
                return { ok: false, error: error.message || "Failed to reset password" }
            }

            return {
                ok: true
            }

        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to SignIn"
            return { ok: false, error: message }


        } finally {
            setResettingPassword(false);
        }

    }

    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

    const signOut = async () => {


        setIsSigningOut(true)
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        navigate("/sign-in", { replace: true })
                    },
                },
            });




        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to SignIn"
            return { ok: false, error: message }

        } finally {
            setIsSigningOut(false);
        }
    }



    return { signUp, isSigningUp, resendVerification, isResending, signIn, isSigningIn, requestPasswordReset, isRequestingPasswordReset, resettingPassword, resetPassword ,isSigningOut,signOut}
}

export { useBetterAuth }
export type { SignUpInput, SignUpResult, SingInInput }
