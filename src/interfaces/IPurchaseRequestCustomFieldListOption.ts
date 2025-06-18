import ICustomFieldListOption from "./ICustomFieldListOption";

export default interface IPurchaseRequestCustomFieldListOption {
  customFieldListOption?: ICustomFieldListOption;
  customFieldListOptionId: string;
  id: string;
  purchaseRequestCustomFieldId: string;
  purchaseRequestId: string;
  selected: boolean;
  customFieldId: string;
}
