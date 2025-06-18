import IHeadOffice from "./IHeadOffice";

export default interface ICategory {
  id?: string;
  code: string;
  description: string;
  headOffice?: IHeadOffice;
}
