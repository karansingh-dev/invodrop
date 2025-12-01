import nodemailer from "nodemailer";


export const sendEmail = async (
  toEmail: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    // Create a transporter using Gmail SMTP and App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_EMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.NODE_MAILER_EMAIL,
      to: toEmail, // Recipient's email
      subject: subject, // Subject of the email

      html: html,
    };

    //verifying before sending
    await transporter.verify();
    console.log("SMTP server is ready to take messages");

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};