export default interface IPurchaseRequestType {
  id?: string;
  description: string;
  allowsChangeUnitPrice?: boolean;
  showMoreFields?: boolean;
  requiredAttachments?: boolean;
  purchaseRequestProjectRequired?: boolean;
  purchaseRequestWalletRequired?: boolean;
  supplierRequired?: boolean;
  reasonRequired?: boolean;
  accountingAccountRequired?: boolean;
  estimatedDateRequired?: boolean;
  paymentMethodRequired?: boolean;
  reportPurchaseRequest?: string;
  showsItemObservation?: boolean;
}
