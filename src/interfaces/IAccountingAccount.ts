import IHeadOffice from "./IHeadOffice";

export default interface IAccountingAccount {
  id?: string;
  code: string;
  description: string;
  classification: string;
  isActive: boolean;
  headOffice?: IHeadOffice;
}
