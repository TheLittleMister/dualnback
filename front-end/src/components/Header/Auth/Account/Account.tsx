import React, { useContext } from "react";
import { Link, Routes, Route } from "react-router-dom";
import AuthContext from "../../../../context/AuthContext";
import classes from "./Account.module.css";

import AccountForm from "./AccountForms/AccountForm";
import ChangePasswordForm from "./AccountForms/ChangePasswordForm";
import DeleteAccountForm from "./AccountForms/DeleteAccountForm";

import { prettyDate } from "../../../../utils/utils";

const Content: React.FC = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div className={classes["account"]}>
      <p>
        <span>Username: </span>
        {authCtx?.user.username.length! > 30
          ? authCtx?.user.username.slice(0, 27) + "..."
          : authCtx?.user.username}
      </p>
      <p>
        <span>Email: </span>
        {authCtx?.user.email.length! > 30
          ? authCtx?.user.email.slice(0, 27) + "..."
          : authCtx?.user.email}
      </p>
      <p>
        <span>Date joined: </span>
        {prettyDate(authCtx?.user.joined!)}
      </p>
      <br />
      <div className={classes["accountOptions"]}>
        <Link to="change-information/">
          <button>Change Information</button>
        </Link>

        <Link to="change-password/">
          <button>Change Password</button>
        </Link>

        <Link to="delete-account/">
          <button>Delete Account</button>
        </Link>
      </div>
    </div>
  );
};

const Account: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Content />} />
      <Route path="change-information/" element={<AccountForm />} />
      <Route path="change-password/" element={<ChangePasswordForm />} />
      <Route path="delete-account/" element={<DeleteAccountForm />} />
    </Routes>
  );
};

export default Account;
