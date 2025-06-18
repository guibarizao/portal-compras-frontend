export interface IApprovalOption {
  id: string;
  taskId: string;
  code: string;
  description: string;
}

export interface IApprovalTask {
  id: string;
  id_thirdParty: string;
  box: string;
  subject: string;
  description: string;
  content: string;
  sender: string;
  senderName: string;
  owner: string;
  allowNote: boolean;
  options: IApprovalOption[];
  creationDate: string;
  receivedDate: string;
  expirationDate: string;
  expirationMessage: string;
  executionStatus: string;
}
