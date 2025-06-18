import ICostCenter from "./ICostCenter";
import IProduct from "./IProduct";
import IProject from "./IProject";
import IStockRequest from "./IStockRequest";
import IWallet from "./IWallet";

export default interface IStockRequestItem {
  id?: string;
  stockRequestId: string;
  productId: string;
  costCenterId: string;
  walletId?: string | null;
  projectId?: string | null;
  sequence?: number;
  quantity: number;
  comments?: string;
  stockRequest?: IStockRequest;
  product?: IProduct;
  costCenter?: ICostCenter;
  wallet?: IWallet;
  project?: IProject;
}
