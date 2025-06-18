export default interface ISuppliersAttachment {
  id?: string;
  suppliersId: string;
  file: string;
  filename: string;
  description?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
