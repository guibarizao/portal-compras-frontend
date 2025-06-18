export default interface IPurchaseRequestMessage {
  id: string;
  purchaseRequestId: string;
  itemSequence: number;
  sequence: number;
  reason: string;
  sentObservation: string;
  sentDate: Date;
  returnObservation?: string | null;
  returnDate?: Date | null;
  status?: string;
  file?: string;
}
