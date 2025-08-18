import { Resend } from "resend";
import { ApiError } from "@/utils/ApiError";
import { logger } from "@repo/logger";
import config from "@/config/config";

const resend = new Resend(config.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  from = "Acme <onboarding@resend.dev>",
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}): Promise<string> {
  try {
    console.log(from);
    const response = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (!response.data?.id) {
      logger.error("No data.id in resend response", { response });
      throw new ApiError(502, "Failed to send email", [
        "Email provider did not return message ID.",
      ]);
    }

    return response.data.id;
  } catch (err: any) {
    logger.error("Email send failed", {
      message: err.message,
      stack: err.stack,
      to,
      subject,
    });
    throw new ApiError(502, "Failed to send email", [err.message]);
  }
}
