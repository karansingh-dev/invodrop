"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import OrSeparator from "@/components/atoms/or-separator";
import BasicLoader from "@/components/atoms/basic-loader";
import { useSigninForm } from "./useSigninForm";
import { signInWithGoogle } from "@/actions/google-auth-action";

export default function LoginForm() {
  const { register, handleSubmit, errors, loading } = useSigninForm();

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login with your Google account</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={async (e) => {
                  e.preventDefault();
                  await signInWithGoogle();
                }}
              >
                Sign In with Google
              </Button>
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <p className="text-sm text-rose-300 ">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Create Password"
                  />
                  <button
                    className="absolute right-3 top-3"
                    onClick={(e) => {
                      e.preventDefault();
                      setPasswordVisible(!passwordVisible);
                    }}
                  >
                    {passwordVisible ? (
                      <Eye className=" text-balck h-4 w-4" />
                    ) : (
                      <EyeOffIcon className=" text-balck h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-rose-300 ">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" form="loginForm" className="w-full">
                {loading ? <BasicLoader /> : <p> Login</p>}
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
