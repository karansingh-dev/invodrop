import nodemailer from "nodemailer";

interface EmailAttachment {
  filename: string;
  content: Uint8Array<ArrayBufferLike> | string;
  contentType?: string;
}

export const sendEmail = async (
  toEmail: string,
  subject: string,
  html: string,
  attachment?: EmailAttachment
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_EMAIL_PASSWORD,
      },
    });

    const mailOptions: any = {
      from: process.env.NODE_MAILER_EMAIL,
      to: toEmail,
      subject,
      html,
    };

    // If an attachment is provided
    if (attachment) {
      mailOptions.attachments = [
        {
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType ?? "application/octet-stream",
        },
      ];
    }

    await transporter.verify();
    console.log("SMTP server is ready to take messages");

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
