import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { SignUpDataType, signUpSchema } from "@repo/shared";
import { onZodError } from "@/lib/zod-error-handler";
import { useRouter } from "next/navigation";

export const useSignupForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

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
    const { name, email, password } = formData;
    await signUp.email(
      {
        email,
        password,
        name,
        callbackURL: `${window.location.origin}/auth/login`,
      },

      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          reset();
          toast.success("Successfully created account!");
          setLoading(false);
          router.replace(`/auth/signup?email=${email}`);
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message || "Error regsitering user");
          throw new Error("failed to register user");
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
