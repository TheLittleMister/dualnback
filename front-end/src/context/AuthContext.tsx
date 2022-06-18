import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

import { getRefreshTokenObj } from "../utils/utils";

interface userInterface {
  username: string;
  email: string;
  joined: string;
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface AuthContextInterface {
  user: userInterface;
  setUser: Dispatch<SetStateAction<userInterface>>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export default AuthContext;

// Provider
export const AuthProvider: React.FC = (props) => {
  const [user, setUser] = useState<userInterface>({
    username: "",
    email: "",
    joined: "",
    tokens: {
      refresh: "",
      access: "",
    },
  });

  const authContextData: AuthContextInterface = {
    user,
    setUser,
  };

  useEffect(() => {
    const refreshTokenObj = getRefreshTokenObj();
    if (refreshTokenObj && Date.now() < refreshTokenObj.exp * 1000)
      setUser(JSON.parse(localStorage.getItem("data")!));
    else localStorage.removeItem("data");
  }, []);

  return (
    <AuthContext.Provider value={authContextData}>
      {props.children}
    </AuthContext.Provider>
  );
};
