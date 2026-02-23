import { createServer } from "./server";
import { env } from "./utils/env";
import { logger } from "./utils/logger";

const app = createServer();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Listening");
});
