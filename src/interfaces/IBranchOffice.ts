import IHeadOffice from "./IHeadOffice";

export default interface IBranchOffice {
  id?: string;
  headOfficeId: string;
  code: string;
  corporateDocument: string;
  name: string;
  stateRegistrationNumber: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  headOffice?: IHeadOffice;
}
