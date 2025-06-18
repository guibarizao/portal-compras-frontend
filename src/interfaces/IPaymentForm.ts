export default interface IPaymentForm {
  id?: string;
  code: string;
  name: string;
  isActive?: boolean;
  needBankDetails?: boolean;
}
