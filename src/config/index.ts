import dotenv from "dotenv";

dotenv.config();

const env = process.env;

/**
 * This function loads the environment variables from the `.env` file and returns an object with the environment
 * variables as its properties. The returned object contains the following properties:
 * - environment: the environment in which the app is running (e.g. "development", "staging", "production")
 * - port: the port on which the app will listen for incoming requests
 * - redisURL: the URL of the Redis instance
 * - keyTTL: the time-to-live (TTL) for keys in Redis
 * - commandTopic: the name of the Pub/Sub topic for command messages
 * - eventTopic: the name of the Pub/Sub topic for event messages
 * - accessAPI: the URL of the Flow access API
 * - resourceName: the name of the GCP KMS resource
 * - availableKeys: the number of proposer keys available
 * - fungibleTokenAddress: the address of the FungibleToken contract
 * - fusdTokenAddress: the address of the FUSD token contract
 */
const config = () => {
  // App
  const environment = env.ENVIRONMENT;
  const port = env.PORT;

  // Redis
  const redisURL = env.REDIS_URL;
  const keyTTL = env.KEY_TTL;

  // Pub/Sub
  const commandTopic = env.COMMAND_TOPIC;
  const eventTopic = env.EVENT_TOPIC;

  // Flow
  const accessAPI = env.FLOW_ACCESS_API_URL;

  // Authorization
  const resourceName = env.GCP_KMS_RESOURCE_NAME;
  const availableKeys = env.PROPOSER_KEY_COUNT;
  const adminAddress = env.ADMIN_ADDRESS;

  // Contracts - Standard
  const fungibleTokenAddress = env.FUNGIBLE_TOKEN_ADDRESS;
  const fusdTokenAddress = env.FUSD_TOKEN_ADDRESS;

  return {
    environment,
    port,
    commandTopic,
    eventTopic,
    redisURL,
    keyTTL,
    accessAPI,
    availableKeys,
    fungibleTokenAddress,
    fusdTokenAddress,
    resourceName,
    adminAddress,
  };
};

export default config;
