import { FileText } from "lucide-react"
import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "cn"

function HomePage() {
  return (
    <main className="flex min-h-svh flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="size-4" />
          </div>
          <span className="text-sm font-medium tracking-tight">Invodrop</span>
        </div>

        <Link
          to="/sign-in"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Sign in
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-6 py-10 md:px-10 lg:grid-cols-2 lg:gap-16 lg:py-6">
        <div className="max-w-md">
          <p className="text-sm text-muted-foreground">A calm invoice workspace</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-balance md:text-5xl">
            Hello.
          </h1>
          <p className="mt-4 text-sm leading-6 text-pretty text-muted-foreground">
            Create, send, and track invoices without the clutter. One quiet place
            for the work you already do.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/sign-up"
              className={cn(buttonVariants({ size: "lg" }), "h-10 min-w-36")}
            >
              Get started
            </Link>
            <Link
              to="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-10 min-w-36",
              )}
            >
              Sign in
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Create</span>
            <Separator orientation="vertical" className="h-3" />
            <span>Send</span>
            <Separator orientation="vertical" className="h-3" />
            <span>Track</span>
          </div>
        </div>

        <Card className="w-full max-w-sm justify-self-center shadow-sm lg:justify-self-end">
          <CardHeader className="flex flex-row items-center justify-between">
            <span className="text-xs text-muted-foreground">INV-2048</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              Due
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Billed to</p>
              <p className="mt-1 text-sm font-medium">Northwind Studio</p>
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-2 w-3/4 rounded-full bg-muted" />
              <div className="h-2 w-1/2 rounded-full bg-muted" />
              <div className="h-2 w-5/6 rounded-full bg-muted" />
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-sm font-medium">$2,480.00</span>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}

export default HomePage
