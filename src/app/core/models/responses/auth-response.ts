import {UserRole} from "../../constants";

export interface AuthResponse {
  id: string,
  username: string,
  name: string,
  email: string,
  role: UserRole,
  token: string
}
