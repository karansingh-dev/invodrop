import InvoDropLogo from "@/components/atoms/invodrop-logo";
import TermsAndPolicy from "@/components/atoms/term-policy";
import LoginForm from "@/features/auth/Login/components/login-form";

export default function Login() {
  return (
    <div className="min-h-screen bg-background  flex justify-center ">
      <main className="flex justify-center  items-center flex-col gap-2 p-8 ">
        <div className="flex items-center">
          <InvoDropLogo />
          <h1 className={`text-4xl  font-bold tracking-wide`}>InvoDrop</h1>
        </div>

        {/* sign up form  */}
        <LoginForm />

        <TermsAndPolicy />
      </main>
    </div>
  );
}
