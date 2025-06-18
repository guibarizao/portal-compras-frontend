import ICostCenter from "./ICostCenter";
import IProjectSituation from "./IProjectSituation";
import IProjectValue from "./IProjectValue";
import IUser from "./IUser";

export default interface IProject {
  id?: string;
  code?: string;
  description: string;
  value?: number;
  yearSequential?: number;
  details: string;
  costCenterId: string;
  estimatedStartDate: Date | string;
  estimatedEndDate: Date | string;
  userId?: string;
  isActive?: boolean;
  complementValue?: number;
  complementDescription?: string;
  costCenter?: ICostCenter;
  user?: IUser;
  situationId?: string;
  situation?: IProjectSituation;
  projectValues?: IProjectValue[];
  statusIntegrationErp?: "PENDING" | "ERROR" | "SUCCESS";
  endDate?: Date | string;
}
