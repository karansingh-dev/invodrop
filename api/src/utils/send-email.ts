import envVar from "../config";
import transporter from "../lib/node-mailer";


async function sendEmail({ recipientEmail, subject, text }: { recipientEmail: string, subject: string, text: string }) {

    const mailOptions = {
        from: envVar.NODEMAILER.GMAIL,
        to: recipientEmail,
        subject,
        text

    };

    try {

        const info = await transporter.sendMail(mailOptions)
        console.log(`Email sent to ${recipientEmail}`, info.messageId);

    } catch (error) {
        console.error("Failed to send email", error);
        throw error;
    }


}

export default sendEmail;