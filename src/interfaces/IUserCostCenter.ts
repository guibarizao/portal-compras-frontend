import ICostCenter from "./ICostCenter";
import IUser from "./IUser";

export default interface IUserCostCenter {
  id: string;
  userId: string;
  costCenterId: string;
  user: IUser;
  costCenter: ICostCenter;
}
