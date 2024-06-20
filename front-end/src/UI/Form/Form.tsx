import React, { ReactNode } from "react";

import classes from "./Form.module.css";

const Form = React.forwardRef<
  HTMLButtonElement,
  {
    children?: ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    messages: string[];
    loading: boolean;
    success: boolean;
    submitText: string;
  }
>((props, ref) => {
  return (
    <form onSubmit={props.onSubmit} className={classes["form"]}>
      {props.success && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-check"
          width="2.4rem"
          height="2.4rem"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M5 12l5 5l10 -10"></path>
        </svg>
      )}
      {props.messages.length > 0 && (
        <ul>
          {props.messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}
      {props.children}
      {props.loading ? (
        <div className="loader"></div>
      ) : (
        <button ref={ref}>{props.submitText}</button>
      )}
    </form>
  );
});

export default Form;
