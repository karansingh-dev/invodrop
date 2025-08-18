import { useBetterAuth } from "@/hooks/useBetterAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { resendVerifyEmailSchema, ResendVerifyEmailType } from "@repo/shared";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export const useResendVerifyEmail = () => {
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const { resendVerificationEmail, loading } = useBetterAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerifyEmailType>({
    resolver: zodResolver(resendVerifyEmailSchema),
  });

  const onSubmit: SubmitHandler<ResendVerifyEmailType> = async (data) => {
    try {
      await resendVerificationEmail(data.email);
      setEmailSent(true);
    } catch (error) {
      console.log("failed to send resend email", error);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    loading,
    emailSent,
    errors,
  };
};
