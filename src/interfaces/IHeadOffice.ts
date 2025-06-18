import IBranchOffice from "./IBranchOffice";

export default interface IHeadOffice {
  id?: string;
  code?: string;
  name?: string;
  reportStockRequest?: string | null;
  reportPurchaseRequest?: string | null;
  projectReport?: string | null;
  productReport?: string | null;
  supplierReport?: string | null;
  stockRequestTypeId?: number | null;
  purchaseRequestTypeId?: number | null;
  stockRequestType?: {
    id: string;
    description: string;
  };
  purchaseRequestType?: {
    id: string;
    description: string;
  };
  branchesOffices?: IBranchOffice[];
}
