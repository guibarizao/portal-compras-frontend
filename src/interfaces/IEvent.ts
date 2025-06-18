export default interface IEvent {
  id: string;
  message: string;
  date?: Date;
  erpStatusId?: number | null;
  erpStatusDescription?: string | null;
}
