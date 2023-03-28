import { GcpKmsAuthorizer } from "fcl-gcp-kms-authorizer";
import { sendTransaction } from "flow-cadut";

import { getImports, getTransaction } from "../cadence";
import config from "../config";
import { getFreeKey, lockKey, unlockKey } from "../keys";
import logger from "../logger";
import ICommand from "./command.i";

const { adminAddress, resourceName } = config();

/**
 * Authorizer for GCP KMS.
 */
const authorizer = new GcpKmsAuthorizer(resourceName);

/**
 * The main function in this code. It receives a `message` as input, which is an object with two properties: `type`
 * and `payload`. The `type` is a string that identifies the type of transaction to be performed, and `payload` is
 * an object containing the arguments for the transaction. This function does the following:
 * 1. Calls `getTransaction` with the `message.type` to get the transaction code.
 * 2. Calls `getImports` to get the contract imports address map.
 * 3. Extracts the `args` from the `message.payload`.
 * 4. Calls `getFreeKey` to get a free proposer key index.
 * 5. If a free key is obtained, then it proceeds to send the transaction, otherwise it logs an error and throws an exception.
 * 6. It authorizes the admin key with `authorizer.authorize(adminAddress, 0)` and the proposer key with
 *    `authorizer.authorize(adminAddress, freeProposerKeyIndex)`.
 * 7. Calls `sendTransaction` to send the transaction, passing in the transaction code, payer, signers, proposer, arguments,
 *    address map, and other parameters.
 * 8. If the transaction is successful, it locks the key for the key index and transaction ID by calling
 *    `lockKey(freeProposerKeyIndex, result)`. If it fails, it unlocks the proposer key with `unlockKey(freeProposerKeyIndex)`
 *    and logs an error.
 * @param message An object containing the type and payload of the transaction.
 * @returns the transaction ID if the transaction is successful, or null if there was an error.
 */
const process = async (message: ICommand): Promise<string | null> => {
  // Get the message's transaction code
  const code = getTransaction(message.type);

  // Get contract imports addressMap
  const imports = getImports();

  // Get the message's args
  const args = message.payload;

  // Get free proposer key index
  const freeProposerKeyIndex = await getFreeKey();

  // If we get a key we can proceed otherwise we go to DLQ
  if (freeProposerKeyIndex) {
    // Authorize admin Key
    const admin = authorizer.authorize(adminAddress, 0);

    // Authorize Proposer Key
    const proposer = authorizer.authorize(adminAddress, freeProposerKeyIndex);

    // Send Transaction
    const [result, err] = await sendTransaction({
      code: code,
      payer: admin,
      signers: [admin],
      proposer: proposer,
      args: args,
      limit: 9999,
      addressMap: imports,
      wait: false,
    });

    if (result) {
      // Lock a key for the keyId and txId
      await lockKey(freeProposerKeyIndex, result);
    } else if (err) {
      // Unlock the proposer key from redis
      await unlockKey(freeProposerKeyIndex);
      logger.log({
        level: "error",
        message: `Error: failed while sending transaction: ${err}`,
        source: "process.ts",
      });
      throw new Error("Error sending transaction");
    }

    // Return the txId
    return result;
  } else {
    logger.log({
      level: "error",
      message: `Failed to fetch a free proposer key`,
      source: "process.ts",
    });
    throw new Error("Could not fetch proposer key");
  }

  return null;
};

export default process;
