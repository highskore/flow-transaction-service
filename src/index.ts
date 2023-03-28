import * as fcl from "@onflow/fcl";

import config from "./config";
import logger from "./logger";
import * as consumer from "./subscribe";

const { accessAPI } = config();

fcl.config().put("accessNode.api", accessAPI);

/**
 * Initializes the fcl library with the configured `accessAPI` and starts
 * consuming commands and events.
 */
const consume = () => {
  logger.log({
    level: "info",
    message: "----------------Starting Flow Transaction Service----------------",
    source: "index.ts",
  });
  consumer.sub();
};

try {
  consume();
} catch (err) {
  logger.error(err);
}

process.on("SIGINT", () => {
  logger.log({
    level: "info",
    message: "----------------Stopping Flow Transaction Service----------------",
    source: "index.ts",
  });
  process.exit(0);
});
