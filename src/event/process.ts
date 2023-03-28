import { unlockKey } from "../keys";
import logger from "../logger";
import IEvent from "./event.i";

const process = async (message: IEvent) => {
  try {
    await unlockKey(message.flowTransactionId);
  } catch (err) {
    logger.log({
      level: "error",
      message: `Error failed to release key for event: ${message}, ${err}`,
      source: "process.ts",
    });
  }
};

export default process;
