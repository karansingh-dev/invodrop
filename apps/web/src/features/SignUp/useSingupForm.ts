import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { sendVerificationEmail, signUp } from "@/lib/auth-client";
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
    watch,
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

  const resendVerificationEmail = async (
    email: string | null
  ): Promise<void> => {
    if (email == null) {
      toast.error("Failed to resend email");
      return;
    }
    await sendVerificationEmail(
      {
        email,
        callbackURL: `${window.location.origin}/auth/login`,
      },
      {
        onSuccess: () => {
          toast.success("Sent Email");
        },
        onError: (ctx) => {
          console.log("failed to resend verificaiton email");
          toast.error("Failed to resend email");
        },
      }
    );
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit, onZodError),
    errors,
    reset,
    resendVerificationEmail,

    loading,
  };
};
