import IUser from "./IUser";

interface IProjectValueStatus {
  id: string;
  description: string;
}

export default interface IProjectValue {
  id?: string;
  projectId: string;
  value?: number;
  description: string;
  statusId: string;
  status: IProjectValueStatus;
  created_at: string;
  userId: string;
  user: IUser;
}
