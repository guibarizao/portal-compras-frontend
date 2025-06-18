export interface IConfigureApplication {
  id?: string;
  name: string;
  username?: string;
  password?: string;
  url?: string;
  port: number;
  database?: string;
  token?: string;
  payload?: string;
  bearer?: string;
  key?: string;
  secret?: string;
  developerApplicationKey?: string;
  clientId?: string;
  clientSecret?: string;
  created_at?: string;
  updated_at?: string;
}
