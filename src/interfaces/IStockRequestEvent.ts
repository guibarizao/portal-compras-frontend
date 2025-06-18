export default interface IStockRequestEvent {
  id?: string;
  stockRequestId: string;
  stockRequestErpStatusId: number | null;
  message: string | null;
  created_at?: Date;
  updated_at?: Date;
  stockRequestErpStatus?: {
    id: number;
    description: string;
  };
}
