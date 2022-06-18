import React, { useState, useContext } from "react";
import AuthContext from "../../../../context/AuthContext";
import Form from "../../../../UI/Form/Form";
import { urlAPI, colorScheme } from "../../../../utils/utils";

import PasswordResetForm from "./ResetForms/PasswordResetForm";
import PasswordResetConfirmForm from "./ResetForms/PasswordResetConfirmForm";

import { useNavigate, Link, Routes, Route } from "react-router-dom";

const Content: React.FC = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const logInFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessages([]);

    if (Boolean(authCtx?.user.username)) return;

    const dataArr = [...new FormData(e.target as HTMLFormElement)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + "login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
    });

    const data = await result.json();
    if (!result.ok) throw new Error("Something went wrong! 🍰");

    if (data.errors && data.errors.length > 0) {
      setMessages(data.errors);
      setLoading(false);
    } else {
      authCtx?.setUser(data);
      localStorage.setItem("data", JSON.stringify(data));
      navigate("/", { replace: true });
    }
  };

  return (
    <Form
      onSubmit={logInFormHandler}
      messages={messages}
      loading={loading}
      success={false}
      submitText={"Log In"}
    >
      <label htmlFor="id_username">Username/Email:</label>
      <input
        type="text"
        name="username"
        autoFocus
        autoCapitalize="none"
        autoComplete="username"
        maxLength={60}
        required
        id="id_username"
      />

      <label htmlFor="id_password">Password:</label>
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
        id="id_password"
        style={colorScheme()}
      />
      <Link to="password_reset/">Forgot password?</Link>
    </Form>
  );
};

const LogInForm: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Content />} />
      <Route path="password_reset/" element={<PasswordResetForm />} />
      <Route
        path="password_reset/confirm/:token"
        element={<PasswordResetConfirmForm />}
      />
    </Routes>
  );
};

export default LogInForm;
