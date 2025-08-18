import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { CreateCompanyData } from "@repo/shared";

export const useOnboardingMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateCompanyData) => {
      return apiRequest<string, CreateCompanyData>("/user/onboarding", {
        method: "POST",
        data,
        protected: true,
      });
    },
  });
};
