export interface UserAccount {
  id: string;
  username: string;
  password: string;
  fullName: string;
  roleTitle: string;
  department: string;
  businessManager: string;
  createdAt?: string;
}

export interface AuthSession {
  token: string;
  user: UserAccount;
  loginAt: string;
}
