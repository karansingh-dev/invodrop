import app from "@/app";
import config from "@/config/config";
import { logger } from "@repo/logger";

app.listen(config.PORT, () => {
  logger.info(`Server started at port ${config.PORT}`);
});
