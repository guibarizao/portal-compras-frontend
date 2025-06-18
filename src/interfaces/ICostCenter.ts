import IHeadOffice from "./IHeadOffice";

export default interface ICostCenter {
  id?: string;
  code: string;
  description: string;
  classification: string;
  headOffice?: IHeadOffice;
}
