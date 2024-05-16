import { web } from "./app/web.js";
import { logger } from "./app/logging.js";

web.listen(5000, () => {
  logger.info("Server started at http://localhost:5000");
});