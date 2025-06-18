import ICustomFieldDocumentType from "./ICustomFieldDocumentType";
import ICustomFieldListOption from "./ICustomFieldListOption";
import ICustomFieldType from "./ICustomFieldType";

export default interface ICustomField {
  id?: string;
  description: string;
  isActive: boolean;
  isRequired: boolean;
  typeId: number;
  documentTypeId: number;
  type?: ICustomFieldType;
  documentType?: ICustomFieldDocumentType;
  customFieldListOptions?: ICustomFieldListOption[] | null;
  listType?: "SIMPLE" | "MULTIPLE" | null;
}
