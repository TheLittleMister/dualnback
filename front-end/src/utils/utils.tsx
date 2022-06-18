import { AuthContextInterface } from "../context/AuthContext";
import jwt_decode from "jwt-decode";

export const urlAPI: string = "https://dualn-back.com/api/";

// Get Score
// const getAlternativeScore = (TP, TN, FP, FN) => (((TP + TN) / (TP + TN + FP + FN)) * 100).toFixed(2);
export const getScore = (TP: number, FP: number, FN: number) =>
  Number(
    TP ? ((TP / (TP + FP + FN)) * 100).toFixed(2) : FP || FN ? 0.0 : 100.0
  );

// Random Integer Function
export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const prettyDate = (a: string) => {
  const b = new Date(a),
    c = (new Date().getTime() - b.getTime()) / 1e3,
    d = Math.floor(c / 86400);
  if (isNaN(d) || 0 > d || 31 <= d) return b.toString().slice(0, 21);
  const h =
    (0 === d &&
      ((60 > c && "Just now") ||
        (120 > c && "1 minute ago") ||
        (3600 > c && Math.floor(c / 60) + " minutes ago") ||
        (7200 > c && "1 hour ago") ||
        (86400 > c && Math.floor(c / 3600) + " hours ago"))) ||
    b.toString().slice(0, 21);
  return h;
};

export const logOut = (authCtx: AuthContextInterface) => {
  localStorage.removeItem("data");
  authCtx?.setUser({
    username: "",
    email: "",
    joined: "",
    tokens: {
      refresh: "",
      access: "",
    },
  });
};

export const refreshToken = async (authCtx: AuthContextInterface) => {
  const response = await fetch(urlAPI + "token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: authCtx?.user.tokens.refresh }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    logOut(authCtx);
    return { refreshed: false };
  } else {
    authCtx?.setUser((prevState) => {
      const newState = { ...prevState };
      newState.tokens.access = responseData.access;
      localStorage.setItem("data", JSON.stringify(newState));
      return newState;
    });

    return { refreshed: true };
  }
};

export const colorScheme = () => {
  return {
    colorScheme:
      localStorage.getItem("light") &&
      Boolean(Number(localStorage.getItem("light")))
        ? "light"
        : "dark",
  };
};

export const getRefreshTokenObj = () => {
  if (localStorage.getItem("data")) {
    const tokenObj: {
      exp: number;
      iat: number;
      jti: string;
      token_type: string;
      user_id: number;
    } = jwt_decode(JSON.parse(localStorage.getItem("data")!).tokens.refresh);

    return tokenObj;
  }

  return null;
};
