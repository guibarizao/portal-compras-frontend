import ICustomField from "./ICustomField";
import IPurchaseRequestCustomFieldListOption from "./IPurchaseRequestCustomFieldListOption";

export default interface IPurchaseRequestCustomField {
  id: string;
  purchaseRequestId: string;
  customFieldId: string;
  value: string | null;
  customField: ICustomField;
  purchaseRequestCustomFieldListOptions: IPurchaseRequestCustomFieldListOption[];
}
