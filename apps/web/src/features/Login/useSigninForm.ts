import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { SignInDataType, signInSchema } from "@repo/shared";
import { onZodError } from "@/lib/zod-error-handler";
import { useRouter } from "next/navigation";

export const useSigninForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

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
    const { email, password } = formData;
    await signIn.email(
      {
        email,
        password,
      },

      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          reset();
          toast.success("Successfully loged in!");
          setLoading(false);
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message || "Error regsitering user");
        },
      }
    );
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit, onZodError),
    errors,
    reset,
    loading,
  };
};
