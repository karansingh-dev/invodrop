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
import Link from "next/link";

export const SignupFormSchema = z.object({
  email: z.email(),
  name: z.string(),
  password: z.string(),
});

type SignupForm = z.infer<typeof SignupFormSchema>;

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { register, reset, handleSubmit } = useForm<SignupForm>({
    defaultValues: {
      name: "",
      password: "",
      email: "",
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    try {
      setLoading(true);
     await authClient.signUp.email(
        {
          ...data,
          callbackURL: `${window.origin}/login`,
        },
        {
          onSuccess: () => {
            toast.success("Signup Successfull, please verify your email");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error("Failed to signup user", error);
      toast.error("Failed to Signup, try again");
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription className="text-gray-500">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" >
        <form
          id="signup-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              {...register("name")}
              id="name"
              className="rounded-lg focus:ring-2 focus:ring-primary"
              type="text"
              placeholder="John Doe"
            />
          </div>
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
            form="signup-form"
            className="w-full cursor-pointer rounded-lg font-semibold tracking-wide"
            type="submit"
          >
            {loading ? <BasicLoader /> : "Signup"}
          </Button>
        </form>
        <div className="text-sm text-gray-500 ">
          Already have an Account ?{" "}
          <Link href={"/login"} className="underline text-blue-500">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
