import { requestPasswordReset } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordDataType, forgotPasswordSchema } from "@repo/shared";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

export const useForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordDataType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordDataType> = async (data) => {
    await requestPasswordReset(
      {
        email: data.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          setEmailSent(true);
          toast.success("Reset password email sent");
        },
        onError: (ctx) => {
          console.error("failed to send reset password email", ctx.error);
          setLoading(false);
          toast.error("Failed to send reset password email, try again");
        },
      }
    );
  };

  const email = watch("email");

  return {
    email,
    register,
    handleSubmit,
    onSubmit,
    loading,
    emailSent,
    errors,
  };
};


export type UseForgotPasswordReturn = ReturnType<typeof useForgotPasswordForm>