export default interface IPurchaseRequestMessageAttachment {
  purchaseRequestMessageId: string | null;
  file: string;
  filename?: string;
  month?: string;
  tenantDomain?: string;
}
