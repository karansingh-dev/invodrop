"use client";
import BasicLoader from "@/components/atoms/basic-loader";
import SuccessCheck from "@/components/atoms/success-check";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface verifyPageProps {
    onBackToSignUp: () => void;
}

export default function VerifyEmail({ onBackToSignUp }: verifyPageProps) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");




    return <div className="space-y-8 w-full max-w-md mx-auto text-center ">

        <SuccessCheck />


        <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight">Account Created Successfully!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
                Your account has been created. Please verify your email to complete the registration.
            </p>
        </div>


        <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Verification email sent to:</p>
            {email ? <p className="font-medium text-sm">{email} </p> : <BasicLoader />}
        </div>

        <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>Next steps:</strong>
            </p>
            <div className="text-left space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                    <span>Check your email inbox (and spam folder)</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                    <span>Click the verification link in the email</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                    <span>Login to your InvoDrop account</span>
                </div>
            </div>
        </div>


        <div className="space-y-4">


            <div className="text-sm  text-muted-foreground">
                <span>
                    Didn&apos;t receive the email? Check your spam folder or&nbsp;

                </span>

                <button


                    className="text-primary  hover:underline font-medium transition-colors"
                >
                    resend email
                </button>
            </div>
        </div>

        <div className="pt-4 border-t border-border/50">
            <a

                onClick={(e) => {
                    e.preventDefault
                    onBackToSignUp();
                    router.replace("/auth/signup")

                }}
                className="text-primary hover:underline font-medium transition-colors text-sm"
            >
                ← Back to sign up
            </a>
        </div>
    </div>

}