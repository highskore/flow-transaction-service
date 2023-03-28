# Flow Transaction Service

A middleware microservice for admin backend and Flow blockchain interaction.

## Scripts

### Development

1. `git clone` the repository to your local machine.
2. run `npm install` to install dependencies.
3. remove the `.example` extension at the end of the `.env.example` file and adjust environment variables to your needs.
4. run `redis-stack-server` to run a local redis instance
5. run `npm run dev-server` to start the local development server.

## GCP KMS Setup

The @fcl-kms-gcp-authorizer library requires authentication with google. It is recommended to use an environment
variable to set up the authentication using a google account authentication JSON file. This variable only applies to the
current shell session, so if a new session is open, the variable must be set again.

```bash
$ export GOOGLE_APPLICATION_CREDENTIALS= "PATH"
# -> PATH = /home/user/Downloads/service-account-file.json
```

> Google Cloud Documentation for authentication: https://cloud.google.com/docs/authentication/getting-started

## Source Files

    .
    ├── cadence            # Flow (Cadence) transactions and import address map
    ├── commands           # Processing flow commands (transactions) received from Google Pub/Sub
    ├── config             # Project configuration variables, imported from .env
    ├── event              # Processing flow events received from Google Pub/Sub
    ├── keys               # Proposer key handling logic
    ├── logger             # Winston logger configuration
    ├── redis              # Functions used to interact with Redis
    ├── typings            # Typescript module declarations
    ├── subscribe          # Receive/Send Google Pub/Sub messages
    └── index.ts

## Google Pub/Sub

This service is subscribed to two Google Pub/Sub topics defined inside the `.env` file:

```bash
COMMAND_TOPIC=test.blockchain.flow.commands-sub
EVENT_TOPIC=test.blockchain.flow.events-sub
```

The expected message format for the Flow Command Topic defined inside the `ICommand` interface (command/command.i.ts)

```javascript
export default interface ICommand {
  id: string; // Backend generated unique id
  type: TransactionName; // The name of the transaction
  callbackTopic: string; // Callback topic used to publish transaction id after succesful command processing
  payload: Array<any>; // Transaction arguments
}
```

The expected message format for the Flow Event Topic defined inside the `IEvent` interface (event/event.i.ts)

```javascript
export default interface IEvent {
  flowTrasactionId: string; // Transaction id of an event
}
```

## Implementing New Transactions

To add a new transaction that interacts with a Flow Smart Contract, only files inside the cadence folder should be
changed, if necessary, files inside the `config/env` can be changed. Follow this checklist to add a new transaction:

1. If the `.env` and `config` files do not contain the contract address, add the contract address to the `.env` and
   `config` files, as well as to the `getImports method` inside the `cadence/index.ts` file
2. Add the new transaction to the `cadence/transactions` folder, the folder name should match the contract name
3. Add a new line containing the path to your newly added transaction inside the `codes.ts` file, making sure to keep
   the following format:

```javascript
const EXAMPLE_CONTRRACT_TEST = read("./transactions/example/test.cdc"); // Path to the new file

export { .../*previous exports*/ EXAMPLE_CONTRRACT_TEST}
```

4. Add your new tranasction to the `TransactioName` enum and the switch case inside the `getTransaction` function, in
   the `index.ts` file (`cadence` folder)

```javascript
export enum TransactionName {
  EXAMPLE_CONTRACT_TEST = "EXAMPLE_CONTRACT_TEST"
}
```

```javascript
export const getTransaction = (name: TransactionName): string => {
  switch (name) {
    case TransactionName.EXAMPLE_CONTRACT_TEST:
      return codes.EXAMPLE_CONTRACT_TEST;
  }
};
```

5. Try sending a pubsub message with the `type` field set as the name of your newly added transaction, if you've been
   following the tutorial closely, it should be `EXAMPLE_CONTRACT_TEST`

## Dependencies

- `@google-cloud/logging-winston`: Used to log messages to Google Stackdriver.
- `@google-cloud/pubsub`: Used to receive/send messages to Google Pub/Sub topics.
- `@onflow/fcl`: Library to interact with the Flow blockchain.
- `chalk`: Used to add color to console logs.
- `dotenv`: Used to load environment variables from the `.env` file.
- `fcl-gcp-kms-authorizer`: Library to authenticate with Google Cloud KMS.
- `flow-cadut`: Library to compile Flow (Cadence) code.
- `fs`: The Node.js file system module.
- `ioredis`: A Redis client for Node.js.
- `path`: The Node.js path module.
- `redis`: Redis client for Node.js.
- `winston`: A logger for Node.js.
- `winston-transport`: Transport for winston logger.
