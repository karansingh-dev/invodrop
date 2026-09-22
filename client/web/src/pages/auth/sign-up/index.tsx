import { FileText } from "lucide-react"

import BrandPanel from "@/components/auth/brand-panel"
import SignUpForm from "@/components/auth/sign-up/sign-up-form"

function SignUpPage() {
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

          {/* signup form  */}
          <SignUpForm />


        </div>
      </section>
    </main>
  )
}

export default SignUpPage
