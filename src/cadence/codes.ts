import { readFileSync } from "fs";
import { join } from "path";

export const read = (path: string): string => {
  return readFileSync(join(__dirname, path), "utf8");
};

// FUSD
const FUSD_SETUP_ACCOUNT_CODE = read("./transactions/fusd/setup_account.cdc");

export {
  // FUSD
  FUSD_SETUP_ACCOUNT_CODE,
};
