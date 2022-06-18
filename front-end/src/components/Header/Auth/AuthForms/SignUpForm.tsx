import React, { useContext, useState } from "react";
import AuthContext from "../../../../context/AuthContext";
import Form from "../../../../UI/Form/Form";
import { urlAPI, colorScheme } from "../../../../utils/utils";

import { useNavigate } from "react-router-dom";

import ReCAPTCHA from "react-google-recaptcha";

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const signUpFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessages([]);

    if (Boolean(authCtx?.user.username)) return;

    const dataArr = [...new FormData(e.target as HTMLFormElement)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + "register/", {
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
      onSubmit={signUpFormHandler}
      messages={messages}
      loading={loading}
      success={false}
      submitText={"Sign Up"}
    >
      <label htmlFor="id_username">Username:</label>
      <input type="text" name="username" max="150" required id="id_username" />
      <label htmlFor="id_email">Email:</label>
      <input type="email" name="email" max="60" required id="id_email" />
      <label htmlFor="id_password1">Password:</label>
      <input
        type="password"
        name="password1"
        autoComplete="new-password"
        required
        id="id_password1"
        style={colorScheme()}
      />
      <span className="helptext">
        <ul>
          <li>
            Your password can't be too similar to your other personal
            information.
          </li>
          <li>Your password must contain at least 8 characters.</li>
          <li>Your password can't be a commonly used password.</li>
          <li>Your password can't be entirely numeric.</li>
        </ul>
      </span>
      <label htmlFor="id_password2">Password confirmation:</label>
      <input
        type="password"
        name="password2"
        autoComplete="new-password"
        required
        id="id_password2"
        style={colorScheme()}
      />
      <span className="helptext">
        Enter the same password as before, for verification.
      </span>
      <ReCAPTCHA
        sitekey="6LdIujwcAAAAAIqCihjyv-GXmgMO4IeOIrTg-iGI"
        theme={"dark"}
      />
    </Form>
  );
};

export default SignUpForm;
