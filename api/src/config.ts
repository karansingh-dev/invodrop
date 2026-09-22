import dotenv from "dotenv"

dotenv.config();

const envVar = {
   PORT: process.env.PORT,
   DATABASE_URL: process.env.DATABASE_URL,
   NODEMAILER: {
      GMAIL: process.env.GMAIL,
      GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD
   },
   FRONTEND_URL: process.env.FRONTEND_URL,
   ENV: process.env.ENV


}


export default envVar;