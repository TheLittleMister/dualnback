import React, { useContext } from "react";

import classes from "./Auth.module.css";
import Modal from "../../../UI/Modal/Modal";

import SignUpForm from "./AuthForms/SignUpForm";
import LogInForm from "./AuthForms/LogInForm";

import Account from "./Account/Account";
import Statistics from "./Statistics/Statistics";
import AuthContext from "../../../context/AuthContext";

import { logOut } from "../../../utils/utils";

import { Routes, Route, Link } from "react-router-dom";

import PrivateRoute from "../../../utils/PrivateRoute";
import PublicRoute from "../../../utils/PublicRoute";

const Content: React.FC = () => {
  const authCtx = useContext(AuthContext);
  return (
    <div className={classes["session-buttons"]}>
      {Boolean(authCtx?.user.username) ? (
        <div className={classes["dropdown"]}>
          <button>
            <div>
              {authCtx?.user.username.length! > 14
                ? authCtx?.user.username.slice(0, 11) + "..."
                : authCtx?.user.username}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
              >
                <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"></path>
              </svg>
            </div>
          </button>
          <div className={classes["dropdown-content"]}>
            <Link to="account/">
              <button>Account</button>
            </Link>

            <Link to="statistics/">
              <button>Statistics</button>
            </Link>

            <button onClick={() => logOut(authCtx!)}>Log Out</button>
          </div>
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

          <Route
            path="statistics/"
            element={
              <Modal title={"Statistics"} closePath={"/"}>
                <Statistics />
              </Modal>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default Auth;
