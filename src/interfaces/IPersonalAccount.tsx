import IRole from "./IRole";

interface IPersonalAccount {
  id: string;
  name: string;
  email: string;
  roles: Array<IRole>;
}

export default IPersonalAccount;
