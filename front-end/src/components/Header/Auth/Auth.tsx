import React, { useContext } from "react";

import classes from "./Auth.module.css";
import Modal from "../../../UI/Modal/Modal";

import SignUpForm from "./AuthForms/SignUpForm";
import LogInForm from "./AuthForms/LogInForm";

import Account from "./Account/Account";
import AuthContext from "../../../context/AuthContext";

import { Routes, Route, Link } from "react-router-dom";

import PrivateRoute from "../../../utils/PrivateRoute";
import PublicRoute from "../../../utils/PublicRoute";

const Content: React.FC = () => {
  const authCtx = useContext(AuthContext);
  return (
    <div className={classes["session-buttons"]}>
      {Boolean(authCtx?.user.username) ? (
        <div>
          <Link to="account/">
            <button>
              {authCtx?.user.username.length! > 14
                ? authCtx?.user.username.slice(0, 11) + "..."
                : authCtx?.user.username}{" "}
              <span className="yellow">&#x2b98;</span>
            </button>
          </Link>
        </div>
      ) : (
        <>
          <Link to="signup/">
            <button>Sign Up</button>
          </Link>

          <Link to="login/">
            <button>Log In</button>
          </Link>
        </>
      )}
    </div>
  );
};

const Auth: React.FC = () => {
  return (
    <>
      <Content />
      <Routes>
        <Route element={<PublicRoute redirectPath={"/"} />}>
          <Route
            path="login/*"
            element={
              <Modal title={"Log In"} closePath={"/"}>
                <LogInForm />
              </Modal>
            }
          />

          <Route
            path="signup/"
            element={
              <Modal title={"Sign Up"} closePath={"/"}>
                <SignUpForm />
              </Modal>
            }
          />
        </Route>

        <Route element={<PrivateRoute redirectPath={"/login"} />}>
          <Route
            path="account/*"
            element={
              <Modal title={"Account"} closePath={"/"}>
                <Account />
              </Modal>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default Auth;
