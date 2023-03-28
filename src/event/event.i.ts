/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface IEvent {
  id: string;
  graffleProjectId: string;
  graffleCompanyId: string;
  flowEventId: string;
  graffleEventToken: string;
  blockHeight: number;
  eventDate: string;
  createdAt: string;
  metaData?: any;
  blockEventData: any;
  webHook: string;
  flowBlockId: string;
  flowTransactionId: string;
  transactionIndex: number;
  eventIndex: number;
  collectionId: string;
  graffleWebHookDataId: string;
}
