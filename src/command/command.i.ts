import { TransactionName } from "../cadence";

/**
 * Interface for a command.
 */
export default interface ICommand {
  /**
   * The command's ID.
   */
  id: string;

  /**
   * The name of the transaction to be executed.
   */
  type: TransactionName;

  /**
   * The topic to be used for the command's callback.
   */
  callbackTopic: string;

  /**
   * The payload to be passed to the transaction.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Array<any>;
}
