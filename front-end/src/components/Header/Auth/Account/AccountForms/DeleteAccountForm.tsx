import React, { useContext, useState } from "react";
import AuthContext from "../../../../../context/AuthContext";
import Form from "../../../../../UI/Form/Form";
import {
  urlAPI,
  refreshToken,
  logOut,
  colorScheme,
} from "../../../../../utils/utils";

const DeleteAccountForm: React.FC = () => {
  const authCtx = useContext(AuthContext);

  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const deleteAccountFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessages([]);

    if (!Boolean(authCtx?.user.username)) return;

    const dataArr = [...new FormData(e.target as HTMLFormElement)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + "delete_account/", {
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
      if (refreshed) deleteAccountFormHandler(e);

      return;
    }

    if (data.errors && data.errors.length > 0) {
      setMessages(data.errors);
      setLoading(false);
    } else logOut(authCtx!);
  };

  return (
    <Form
      onSubmit={deleteAccountFormHandler}
      messages={messages}
      loading={loading}
      success={false}
      submitText={"Delete Account"}
    >
      <label htmlFor="id_password">
        Complete your{" "}
        <span
          style={{
            fontWeight: "bold",
            color: "var(--red)",
          }}
        >
          permanent deletion
        </span>{" "}
        request by entering your password:
      </label>
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
        id="id_password"
        style={colorScheme()}
      />
    </Form>
  );
};

export default DeleteAccountForm;
