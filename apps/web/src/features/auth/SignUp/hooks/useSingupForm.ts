import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import toast from "react-hot-toast";
import { SignUpDataType, signUpSchema } from "@repo/shared";
import { onZodError } from "@/lib/zod-error-handler";
import { useRouter } from "next/navigation";
import { useBetterAuth } from "@/hooks/useBetterAuth";

export const useSignupForm = () => {
  const router = useRouter();

  const { registerUser, loading } = useBetterAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpDataType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpDataType> = async (formData) => {
    try {
      await registerUser(formData);
      reset();
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return {
    register,

    handleSubmit: handleSubmit(onSubmit, onZodError),
    errors,
    reset,

    loading,
  };
};
