import {UserRole} from "../../constants";

export interface User {
  id: string,
  username: string,
  name: string,
  email: string,
  role: UserRole
}
