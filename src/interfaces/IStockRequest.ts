import IBranchOffice from "./IBranchOffice";
import IStockRequestErpStatus from "./IStockRequestErpStatus";
import IStockRequestType from "./IStockRequestType";
import IUser from "./IUser";

export default interface IStockRequest {
  id?: string;
  branchOfficeId?: string;
  stockRequestTypeId: number;
  integrationStatus?: "PENDING" | "SUCCESS" | "ERROR";
  integrationDate?: Date;
  stockRequestErpStatusId?: number;
  requestNumber?: string;
  protocol?: string;
  isDraft: boolean;
  created_at?: Date;
  updated_at?: Date;
  branchOffice?: IBranchOffice;
  stockRequestType?: IStockRequestType;
  stockRequestErpStatus?: IStockRequestErpStatus;
  userId?: string;
  user?: IUser;
}
