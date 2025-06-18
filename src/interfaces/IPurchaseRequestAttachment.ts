export default interface IPurchaseRequestAttachment {
  id?: string;
  purchaseRequestId: string;
  file: string;
  filename: string;
  created_at: string;
  updated_at: string;
}
