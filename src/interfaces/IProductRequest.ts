import IHeadOffice from "./IHeadOffice";
import IUser from "./IUser";

export default interface IProductRequest {
  id?: string;
  protocol?: string;
  type: "PRODUCT" | "SERVICE";
  description: string;
  details: string;
  isDraft?: boolean;
  created_at?: Date;
  updated_at?: Date;
  closed_at?: Date;
  headOffice?: IHeadOffice;
  user?: IUser;
  productRequestErpStatus?: {
    id: number;
    description: string;
  };
}
