import ISupplier from "./ISupplier";

export default interface ISuppliersBankDetails {
  id?: string;
  supplierId: string;
  bankCode: string;
  accountType: "CURRENT" | "SAVINGS";
  agency: string;
  accountNumber: string;
  pixKeyType: string | null;
  pixKey: string;
  supplier?: ISupplier;
}
