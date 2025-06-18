export default interface IProductRequestEvent {
  id?: string;
  productRequestId: string;
  productRequestErpStatusId: number;
  message: string | null;
  created_at?: Date;
  updated_at?: Date;
  productRequestErpStatus?: {
    id: number;
    description: string;
  };
}
