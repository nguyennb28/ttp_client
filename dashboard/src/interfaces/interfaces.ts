import { ReactNode, Dispatch, SetStateAction, FC } from "react";

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

export interface IFormField {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "date"
    | "time"
    | "select"
    | "checkbox";
  options?: {value: string; label: string}[];
  placeholder?: string
}

// export interface IFormField {
//   name: string; // Unique name for the field (used for state)
//   label: string; // Label displayed to the user
//   type: 'text' | 'number' | 'select' | 'checkbox'; // Add other types as needed
//   options?: { value: string; label: string }[]; // For select and radio buttons
//   // You can add more properties like 'placeholder', 'required', 'validationRules', etc.
// }