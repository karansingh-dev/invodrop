"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useState } from "react";
import BasicLoader from "../atoms/basic-loader";
import { SignupFormSchema } from "./signup-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SigninSchema = SignupFormSchema.omit({ name: true });
type SigninForm = z.infer<typeof SigninSchema>;

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const { register, reset, handleSubmit } = useForm<SigninForm>({
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit: SubmitHandler<SigninForm> = async (data) => {
    try {
      setLoading(true);
      await authClient.signIn.email(
        {
          ...data,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Login Successfull");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error("Failed to signin", error);
      toast.error("Failed to Signin, try again");
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Login to your account
        </CardTitle>
        <CardDescription className="text-gray-500">
          Enter your information below to login
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              {...register("email")}
              id="email"
              className="rounded-lg focus:ring-2 focus:ring-primary"
              type="email"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              {...register("password")}
              id="password"
              className="rounded-lg focus:ring-2 focus:ring-primary"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <Button
            form="login-form"
            className="w-full cursor-pointer rounded-lg font-semibold tracking-wide"
            type="submit"
          >
            {loading ? <BasicLoader /> : "Login"}
          </Button>
        </form>

        <div className="text-sm text-gray-500 ">
          Don't have an Account ?{" "}
          <Link href={"/signup"} className="underline text-blue-500">
            Signup
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
