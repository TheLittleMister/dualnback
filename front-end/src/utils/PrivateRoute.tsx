import React from "react";
import { getRefreshTokenObj } from "./utils";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute: React.FC<{
  redirectPath: string;
}> = (props) => {
  let authenticated = false;

  const refreshTokenObj = getRefreshTokenObj();
  if (refreshTokenObj && Date.now() < refreshTokenObj.exp * 1000)
    authenticated = true;

  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate replace to={props.redirectPath} />
  );
};

export default PrivateRoute;
