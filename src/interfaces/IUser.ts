import ICostCenter from "./ICostCenter";
import IWallet from "./IWallet";

export default interface IUser {
  id: string;
  code: string;
  username: string;
  fullName: string;
  email: string;
  costCenter: ICostCenter;
  wallet?: IWallet;
  lastLogin?: Date;
  isActive?: boolean;
}
