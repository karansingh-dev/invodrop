import { useBetterAuth } from "@/hooks/useBetterAuth";
import { resetPassword } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordType, resetPasswordSchema } from "@repo/shared";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

export const useResetPasswordForm = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorFromUrl = searchParams.get("error");

  const { resetUserPassword, loading } = useBetterAuth();

  const hasError = !token || errorFromUrl === "INVALID_TOKEN";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token ?? "" },
  });

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const onSubmit: SubmitHandler<ResetPasswordType> = async (formData) => {
    try {
      await resetUserPassword(formData);
    } catch (error) {
      console.log("reset password failed");
    }
  };

  return {
    passwordVisible,
    loading,
    onSubmit,
    handleSubmit,
    setPasswordVisible,
    register,
    hasError,
    errors,
  };
};
