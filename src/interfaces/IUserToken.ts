import IBranchOffice from "./IBranchOffice";
import ICostCenter from "./ICostCenter";
import IHeadOffice from "./IHeadOffice";
import IWallet from "./IWallet";

export default interface IUserToken {
  expires_in: number;
  username: string;
  access_token: string;
  refresh_token: string;
  name: string;
  email: string;
  tenantDomain: string;
  logged: boolean;
  typeAuth: string;
  costCenter: ICostCenter | null;
  wallet: IWallet | null;
  branchOffice: IBranchOffice | null;
  resources: string[];
  erpUrl: string;
  headOffices: IHeadOffice[] | null;
}
