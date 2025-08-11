import Link from "next/link";



export default function TermsAndPolicy() {
    return <p className="pt-3 text-sm text-muted-foreground">
        By continue, you agree to our{" "}
        <Link
            href="/terms-of-service"
            className="underline underline-offset-4 hover:text-primary"
        >
            Terms of Service
        </Link>{" "}
        and{" "}
        <Link
            href="/privacy-policty"
            className="underline underline-offset-4 hover:text-primary"
        >
            Privacy Policy
        </Link>

    </p>
}