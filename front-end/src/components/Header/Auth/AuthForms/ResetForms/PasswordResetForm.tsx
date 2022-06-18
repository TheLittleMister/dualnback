import React, { useContext, useState } from "react";
import AuthContext from "../../../../../context/AuthContext";

import Form from "../../../../../UI/Form/Form";
import { urlAPI } from "../../../../../utils/utils";

const PasswordResetForm: React.FC = () => {
  const authCtx = useContext(AuthContext);

  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const passwordResetFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setMessages([]);

    if (Boolean(authCtx?.user.username)) return;

    const dataArr = [...new FormData(e.target as HTMLFormElement)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + "login/password_reset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
    });

    const data = await result.json();

    if (!result.ok) {
      setMessages(data.email);
      setLoading(false);
    } else setSuccess(true);
  };

  return (
    <>
      {!success ? (
        <Form
          onSubmit={passwordResetFormHandler}
          messages={messages}
          loading={loading}
          success={success}
          submitText={"Request password recovery"}
        >
          <label htmlFor="id_email">Email:</label>
          <input
            type="email"
            name="email"
            maxLength={60}
            required
            id="id_email"
          />
        </Form>
      ) : (
        <p style={{ fontSize: "1.6rem", padding: "1rem" }}>
          An email has been sent with instructions to reset your password.
        </p>
      )}
    </>
  );
};

export default PasswordResetForm;
