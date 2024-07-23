import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../../../../context/AuthContext";
import Form from "../../../../../UI/Form/Form";
import { urlAPI, refreshToken, colorScheme } from "../../../../../utils/utils";

const AccountForm: React.FC = () => {
  const authCtx = useContext(AuthContext);

  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const passwordRef = useRef<HTMLInputElement>(null);

  const accountFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setMessages([]);

    if (!Boolean(authCtx?.user.username)) return;

    const dataArr = [...new FormData(e.target as HTMLFormElement)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + "account/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authCtx?.user.tokens.access,
      },
      body: JSON.stringify(dataObj),
    });

    const data = await result.json();
    if (result.status === 401) {
      const { refreshed } = await refreshToken(authCtx!);
      if (refreshed) accountFormHandler(e);

      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
      setLoading(false);
    } else {
      authCtx?.setUser((prevState) => {
        const newState = {
          ...prevState,
          username: data.username,
          email: data.email,
        };

        localStorage.setItem("data", JSON.stringify(newState));
        return newState;
      });
      setLoading(false);
      setSuccess(true);
      passwordRef.current!.value = "";
    }
  };

  return (
    <Form
      onSubmit={accountFormHandler}
      messages={messages}
      loading={loading}
      success={success}
      submitText={"Change Information"}
    >
      <label htmlFor="id_username">Username:</label>
      <input
        type="text"
        name="username"
        maxLength={150}
        required
        id="id_username"
        defaultValue={authCtx?.user.username}
      />

      <label htmlFor="id_email">Email:</label>
      <input
        type="email"
        name="email"
        maxLength={60}
        required
        id="id_email"
        defaultValue={authCtx?.user.email}
      />

      <label htmlFor="id_password">Confirm your password:</label>
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
        id="id_password"
        ref={passwordRef}
        style={colorScheme()}
      />
    </Form>
  );
};

export default AccountForm;
