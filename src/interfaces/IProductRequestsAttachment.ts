export default interface IProductRequestsAttachment {
  id?: string;
  productRequestId: string;
  file: string;
  filename: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
