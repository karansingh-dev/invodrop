import nodemailer from "nodemailer";
import envVar from "../config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envVar.NODEMAILER.GMAIL,
    pass: envVar.NODEMAILER.GMAIL_APP_PASSWORD,
  },
});

transporter.verify().catch((error) => {
  console.error("Mailer is not ready. Check GMAIL and GMAIL_APP_PASSWORD.", error);
});

export default transporter;