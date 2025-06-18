export default interface IPurchaseEvent {
  id?: string;
  purchaseRequestId: string;
  purchaseRequestErpStatusId: number;
  message: string | null;
  created_at?: Date;
  updated_at?: Date;
  purchaseRequestErpStatus?: {
    id: number;
    description: string;
  };
}
