import IHeadOffice from "./IHeadOffice";

export default interface IWallet {
  id?: string;
  code: string;
  description: string;
  headOffice?: IHeadOffice;
  isActive?: boolean;
}
