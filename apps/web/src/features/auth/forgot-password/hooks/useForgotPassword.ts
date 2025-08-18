import { useBetterAuth } from "@/hooks/useBetterAuth";

import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordDataType, forgotPasswordSchema } from "@repo/shared";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export const useForgotPasswordForm = () => {
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const { requestResetUserPassword, loading } = useBetterAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordDataType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordDataType> = async (data) => {
    try {
      await requestResetUserPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      console.log("request reset password failed", error);
    }
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

export type UseForgotPasswordReturn = ReturnType<typeof useForgotPasswordForm>;
