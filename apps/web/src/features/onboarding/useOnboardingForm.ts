import { apiRequest } from "@/lib/api";
import { CreateCompanyData } from "@repo/shared";

async function addComapny(data: CreateCompanyData):Promise {
  return await apiRequest<null, CreateCompanyData>("/user/onboarding", {
    method: "POST",
    data: data,
  });

  
}
