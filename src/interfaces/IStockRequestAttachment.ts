export default interface IStockRequestAttachment {
  id?: string;
  stockRequestId: string;
  file: string;
  filename: string;
  created_at: string;
  updated_at: string;
}
