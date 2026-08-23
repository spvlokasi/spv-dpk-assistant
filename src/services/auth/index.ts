import { AuthSessionStorage, DEFAULT_USER } from './authSession';
import { handleUserLogin } from './authLogin';
import { handleUpdateAccount } from './authUpdate';

export const AuthService = {
  ...AuthSessionStorage,
  login: handleUserLogin,
  updateAccount: handleUpdateAccount
};

export { DEFAULT_USER };
