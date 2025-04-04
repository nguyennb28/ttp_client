import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from "react";
import axiosInstance from "../instance/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

interface IUser {
  [key: string]: any;
}

interface ITokenPayload {
  exp: number;
  [key: string]: any;
}

interface IAuthContext {
  user: IUser | null;
  userLoading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ access: string; refresh: string; user: IUser }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  checkRole: () => void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

// const AuthContext = createContext<IAuthContext | undefined>(undefined);
const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const login = async (username: string, password: string) => {
    try {
      const { data: tokenData } = await axiosInstance.post("/token/", {
        username,
        password,
      });
      const { access, refresh } = tokenData;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const { data: userData } = await axiosInstance.get("/users/me/");
      setUser(userData);
      return { access, refresh, user: userData };
    } catch (err: any) {
      throw new Error(err.reponse?.data?.detail || "Đăng nhập thất bại");
    }
  };
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const callRefreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    try {
      const { data: response } = await axiosInstance.post(`/token/refresh/`, {
        refresh,
      });
      const { access } = response;
      localStorage.setItem("access", access);
      window.location.reload();
    } catch (err) {
      console.error(
        `Không lấy được refresh token hoặc có thể không call được api ${err}`
      );
      throw err;
    }
  };

  const checkAuth = async () => {
    const access = localStorage.getItem("access");
    if (!access) {
      logout();
      return;
    }
    try {
      const decoded: ITokenPayload = jwtDecode(access);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;
      if (tokenExpiration !== undefined && tokenExpiration < now) {
        await callRefreshToken();
      }
    } catch (err) {
      console.error(`Token không hợp lệ hoặc xảy ra lỗi khi decode: ${err}`);
      logout();
    }
  };

  const checkRole = () => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signin", { replace: true });
    }
    if (user && user.role === "user") {
      logout();
      navigate("/signin", { replace: true });
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
        const access = localStorage.getItem("access");
        if (access) {
          const { data: response } = await axiosInstance.get("/users/me/");
          setUser(response);
        }
      } catch (err) {
        console.error(`Lỗi khi kiểm tra xác thực: ${err}`);
        logout();
      } finally {
        setUserLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    userLoading,
    login,
    logout,
    checkAuth,
    setUser,
    checkRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// import React, {
//   useState,
//   useEffect,
//   useContext,
//   createContext,
//   ReactNode,
//   Dispatch,
//   SetStateAction,
//   FC,
// } from "react";
// import axiosInstance from "./axiosInstance";
// import jwtDecode from "jwt-decode";

// interface IUser {
//   // Định nghĩa các thuộc tính của user nếu có, hoặc sử dụng kiểu bất kỳ
//   [key: string]: any;
// }

// interface ITokenPayload {
//   exp: number;
//   // Các thuộc tính khác của payload nếu cần
//   [key: string]: any;
// }

// interface IAuthContext {
//   user: IUser | null;
//   userLoading: boolean;
//   login: (
//     username: string,
//     password: string
//   ) => Promise<{ access: string; refresh: string; user: IUser }>;
//   logout: () => Promise<void>;
//   checkAuth: () => Promise<void>;
//   setUser: Dispatch<SetStateAction<IUser | null>>;
// }

// interface IAuthProviderProps {
//   children: ReactNode;
// }

// const AuthContext = createContext<IAuthContext | undefined>(undefined);

// export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<IUser | null>(null);
//   const [userLoading, setUserLoading] = useState<boolean>(true);

//   const login = async (
//     username: string,
//     password: string
//   ): Promise<{ access: string; refresh: string; user: IUser }> => {
//     try {
//       const { data: tokenData } = await axiosInstance.post("/token/", {
//         username,
//         password,
//       });
//       const { access, refresh } = tokenData;
//       localStorage.setItem("access", access);
//       localStorage.setItem("refresh", refresh);

//       const { data: userData } = await axiosInstance.get("/users/me/");
//       setUser(userData);
//       return { access, refresh, user: userData };
//     } catch (err: any) {
//       throw new Error(err.response?.data?.detail || "Đăng nhập thất bại");
//     }
//   };

//   const logout = async () => {
//     setUser(null);
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//   };

//   const callRefreshToken = async () => {
//     const refresh = localStorage.getItem("refresh");
//     try {
//       const { data: response } = await axiosInstance.post(`/token/refresh/`, {
//         refresh,
//       });
//       const { access } = response;
//       localStorage.setItem("access", access);
//       window.location.reload();
//     } catch (err: any) {
//       console.error(
//         `Không lấy được refresh token hoặc có thể không call được api ${err}`
//       );
//       throw err;
//     }
//   };

//   const checkAuth = async () => {
//     const access = localStorage.getItem("access");
//     if (!access) {
//       await logout();
//       return;
//     }
//     try {
//       const decoded: ITokenPayload = jwtDecode(access);
//       const tokenExpiration = decoded.exp;
//       const now = Date.now() / 1000;
//       if (tokenExpiration < now) {
//         await callRefreshToken();
//       }
//     } catch (err) {
//       console.error(`Token không hợp lệ hoặc xảy ra lỗi khi decode: ${err}`);
//       await logout();
//     }
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         await checkAuth();
//         const access = localStorage.getItem("access");
//         if (access) {
//           const { data: response } = await axiosInstance.get("/users/me/");
//           setUser(response);
//         }
//       } catch (err) {
//         console.error(`Lỗi khi kiểm tra xác thực: ${err}`);
//         await logout();
//       } finally {
//         setUserLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const value = { user, login, logout, checkAuth, userLoading, setUser };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = (): IAuthContext => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth phải được sử dụng trong AuthProvider");
//   }
//   return context;
// };
