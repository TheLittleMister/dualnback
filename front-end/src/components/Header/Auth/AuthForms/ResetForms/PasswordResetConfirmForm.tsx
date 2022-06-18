import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../../../../context/AuthContext";

import { urlAPI, colorScheme } from "../../../../../utils/utils";
import Form from "../../../../../UI/Form/Form";

const PasswordResetConfirmForm: React.FC = () => {
  const params = useParams();
  const authCtx = useContext(AuthContext);

  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const passwordResetConfirmFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setMessages([]);

    if (Boolean(authCtx?.user.username)) return;

    const dataArr = [...new FormData(e.target as HTMLFormElement)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + "login/password_reset/confirm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
    });

    const data = await result.json();

    if (!result.ok) {
      if (data.detail) setMessages(["It has already been changed."]);
      if (data.password) setMessages(data.password);
      setLoading(false);
    } else setSuccess(true);
  };

  return (
    <>
      {!success ? (
        <Form
          onSubmit={passwordResetConfirmFormHandler}
          messages={messages}
          loading={loading}
          success={success}
          submitText={"Change Password"}
        >
          <input
            type="hidden"
            name="token"
            maxLength={150}
            defaultValue={params.token}
            required
          />

          <label htmlFor="id_password">New password:</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            id="id_password"
            style={colorScheme()}
          />
        </Form>
      ) : (
        <p style={{ fontSize: "1.6rem", padding: "1rem" }}>
          Password has been changed.
        </p>
      )}
    </>
  );
};

export default PasswordResetConfirmForm;
