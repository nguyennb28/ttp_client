import {
    ReactNode,
    Dispatch,
    SetStateAction,
    FC,
  } from "react";

export interface IUser {
  [key: string]: any;
}

export interface ITokenPayload {
  exp: number;
  [key: string]: any;
}

export interface IAuthContext {
  user: IUser | null;
  userLoading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ access: string; refresh: string; user: IUser }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: Dispatch<SetStateAction<IUser | null>>;
}

export interface IAuthProviderProps {
  children: ReactNode;
}