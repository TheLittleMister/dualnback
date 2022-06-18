import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../../../../context/AuthContext";
import Form from "../../../../../UI/Form/Form";
import { urlAPI, refreshToken, colorScheme } from "../../../../../utils/utils";

const ChangePasswordForm: React.FC = () => {
  const authCtx = useContext(AuthContext);

  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPassword1Ref = useRef<HTMLInputElement>(null);
  const newPassword2Ref = useRef<HTMLInputElement>(null);

  const changePasswordFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setMessages([]);

    if (!Boolean(authCtx?.user.username)) return;

    const dataArr = [...new FormData(e.target as HTMLFormElement)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + "change_password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authCtx?.user.tokens.access,
      },
      body: JSON.stringify(dataObj),
    });

    const data = await result.json();

    if (!result.ok) {
      const { refreshed } = await refreshToken(authCtx!);
      if (refreshed) changePasswordFormHandler(e);

      return;
    }

    if (data.errors && data.errors.length > 0) setMessages(data.errors);
    else {
      (e.target as HTMLFormElement).reset();
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <Form
      onSubmit={changePasswordFormHandler}
      messages={messages}
      loading={loading}
      success={success}
      submitText={"Change Password"}
    >
      <label htmlFor="id_old_password">Old password:</label>
      <input
        type="password"
        name="old_password"
        autoComplete="current-password"
        autoFocus
        required
        id="id_old_password"
        ref={oldPasswordRef}
        style={colorScheme()}
      />
      <label htmlFor="id_new_password1">New password:</label>
      <input
        type="password"
        name="new_password1"
        autoComplete="new-password"
        required
        id="id_new_password1"
        ref={newPassword1Ref}
        style={colorScheme()}
      />
      <span className="helptext">
        <ul>
          <li>
            Your password can’t be too similar to your other personal
            information.
          </li>
          <li>Your password must contain at least 8 characters.</li>
          <li>Your password can’t be a commonly used password.</li>
          <li>Your password can’t be entirely numeric.</li>
        </ul>
      </span>
      <label htmlFor="id_new_password2">New password confirmation:</label>
      <input
        type="password"
        name="new_password2"
        autoComplete="new-password"
        required
        id="id_new_password2"
        ref={newPassword2Ref}
        style={colorScheme()}
      />
    </Form>
  );
};

export default ChangePasswordForm;
