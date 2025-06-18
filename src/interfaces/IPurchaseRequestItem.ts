import IAccountingAccount from "./IAccountingAccount";
import ICostCenter from "./ICostCenter";
import IProduct from "./IProduct";
import IProject from "./IProject";
import IPurchaseRequest from "./IPurchaseRequest";
import IWallet from "./IWallet";

export default interface IPurchaseRequestItem {
  id?: string;
  purchaseRequestId: string;
  productId: string;
  costCenterId: string;
  accountingAccountId?: string | null;
  walletId?: string | null;
  projectId?: string | null;
  sequence?: number;
  quantity: number;
  estimatedDate: Date | null;
  comments?: string;
  purchaseRequest?: IPurchaseRequest;
  product?: IProduct;
  costCenter?: ICostCenter;
  accountingAccount?: IAccountingAccount;
  wallet?: IWallet;
  project?: IProject;
  unitPrice?: number;
}
