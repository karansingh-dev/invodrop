import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Users,
  CreditCard,
  BarChart3,
  Send,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary p-1">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                InvoDrop
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground leading-tight">
              Smart Invoicing for
              <span className="block text-primary mt-2">
                Growing Businesses
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mt-6">
              Create invoices, send them to clients, track payments, manage
              clients, and monitor your business from a clean and simple
              dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
              All the tools you need to run your invoicing system smoothly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Create invoices */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Create & Download Invoices</CardTitle>
                <CardDescription>
                  Build professional invoices with automatic calculations and
                  export them instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Manage clients */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  Add, edit, and organize all your clients in one clean
                  dashboard.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Send invoices */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Invoices Instantly</CardTitle>
                <CardDescription>
                  Send invoices directly to your clients’ inbox with one click.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Payment tracking */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Track Payments</CardTitle>
                <CardDescription>
                  Monitor paid, pending, and overdue invoices with real-time
                  status updates.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Dashboard */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Dashboard Overview</CardTitle>
                <CardDescription>
                  Get a quick overview of your revenue, clients, and pending
                  invoices.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Reports */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Reports & Insights</CardTitle>
                <CardDescription>
                  View your income analytics and track business performance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
            Ready to simplify your invoicing?
          </h2>
          <p className="text-lg text-primary-foreground/80 mt-3 mb-8 max-w-2xl mx-auto">
            Join the growing businesses that trust InvoDrop for smart billing.
          </p>

          <Link href="/signup">
            <Button
              size="lg"
              className="h-12 px-8 bg-background text-foreground hover:bg-background/90"
            >
              Start for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <p className="text-sm text-primary-foreground/80 mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
