import { PubSub } from "@google-cloud/pubsub";

import { ICommand, process as processCommand } from "../command";
import config from "../config";
import { IEvent, process as processEvent } from "../event";
import logger from "../logger";

const { commandTopic, eventTopic } = config();

const pubsub = new PubSub();

/**
 * Subscribes to the command and event topics and listens for messages on each topic.
 * When a command message is received, the `processCommand` function is called to handle it.
 * When an event message is received, the `processEvent` function is called to handle it.
 */
function sub() {
  const commands = pubsub.subscription(commandTopic);

  commands.on("message", async (message) => {
    const data: ICommand = JSON.parse(message.data);
    try {
      logger.log({
        level: "info",
        message: `Transaction command received: ${JSON.stringify(data)}`,
        source: "sub.ts",
      });
      const txId = await processCommand(data);
      if (txId) {
        pubsub
          .topic(data.callbackTopic)
          .publishMessage({
            json: {
              commandId: data.id,
              blockchainTxId: txId,
            },
          })
          .catch((error) => {
            logger.log({
              level: "warn",
              message: `Error: failed while publishing to callback topic: ${error}, commandId: ${data.id}, tx: ${txId}`,
              source: "sub.ts",
            });
          });
        message.ack();
      }
    } catch (error) {
      logger.log({
        level: "error",
        message: `Error: failed processing transaction command: ${data?.id}, ${error}`,
        source: "sub.ts",
      });
    }
  });

  const events = pubsub.subscription(eventTopic);

  events.on("message", async (message) => {
    const data: IEvent = JSON.parse(message.data);
    try {
      logger.log({
        level: "info",
        message: `Event received ${JSON.stringify(data)}`,
        source: "sub.ts",
      });
      await processEvent(data);
      message.ack();
    } catch (error) {
      logger.log({
        level: "error",
        message: `Error: failed while processing event: ${data}, ${error}`,
        source: "sub.ts",
      });
    }
  });
}

export default sub;
