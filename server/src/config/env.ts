import "dotenv/config"


export const env = {
    PORT:process.env.PORT,
    LOG_LEVEL:process.env.LOG_LEVEL,
    DATABASE_URL:process.env.DATABASE_URL

}