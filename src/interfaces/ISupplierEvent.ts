export default interface ISupplierEvent {
  id?: string;
  supplierId: string;
  suppliersErpStatusId: number;
  message: string | null;
  created_at?: Date;
  updated_at?: Date;
  supplierErpStatus?: {
    id: number;
    description: string;
  };
}
