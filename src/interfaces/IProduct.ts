import ICategory from "./ICategory";
import IHeadOffice from "./IHeadOffice";

export default interface IProduct {
  id: string;
  code: string;
  description: string;
  headOfficeId?: string;
  categoryId?: string;
  unitOfMeasure: string;
  derivation: string;
  isActive: boolean;
  replacementPrice: number;
  stockQuantity: number;
  averagePrice: number;
  headOffice?: IHeadOffice;
  category: ICategory;
}
