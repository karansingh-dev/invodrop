import { apiRequestClient } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { toast } from "sonner";

export async function sendPdfToMail(id: string) {
  try {
    const res = await apiRequestClient<ApiResponse>(
      "POST",
      `/invoice/${id}/send-mail`
    );

    if (res.success) {
      console.log("Mail sent successfully");
      toast.success("Mail sent");
    } else {
      console.error(res.error);
      toast.error("Failed to send mail,please try again ");
    }
  } catch (error) {
    console.error("Failed to send mail", error);
    toast.error("Failed to send mail, please try again");
  }
}
