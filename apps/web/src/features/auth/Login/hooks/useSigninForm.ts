import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInDataType, signInSchema } from "@repo/shared";
import { onZodError } from "@/lib/zod-error-handler";

import { useBetterAuth } from "@/hooks/useBetterAuth";

export const useSigninForm = () => {
  const { loginUser, loading } = useBetterAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInDataType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInDataType> = async (formData) => {
    try {
      await loginUser(formData);
      reset();
    } catch (error) {
      console.error("Login failed:", error);
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
