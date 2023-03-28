import config from "../config";
import * as codes from "./codes";

/**
 * Enum for TransactionName. Contains the names of all supported transactions.
 * Naming schema: CONTRACTNAME_TRANSACTIONNAME
 */
export enum TransactionName {
  // FUSD
  FUSD_SETUP_ACCOUNT = "FUSD_SETUP_ACCOUNT",
}

/**
 * Returns the transaction code for the given `name`. Throws an error if the `name` is unknown.
 */
export const getTransaction = (name: TransactionName): string => {
  switch (name) {
    // FUSD
    case TransactionName.FUSD_SETUP_ACCOUNT:
      return codes.FUSD_SETUP_ACCOUNT_CODE;
    default:
      throw new Error("Unknown Transaction Name");
  }
};

/**
 * Returns a map of contract addresses.
 */
export const getImports = () => {
  return {
    FungibleToken: config().fungibleTokenAddress,
    FUSD: config().fusdTokenAddress,
  };
};
