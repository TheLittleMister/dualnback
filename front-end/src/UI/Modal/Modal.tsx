import React from "react";
import ReactDOM from "react-dom";

import { useNavigate } from "react-router-dom";

import classes from "./Modal.module.css";

interface ModalProps {
  title: string;
  closePath: string;
}

const ModalElement: React.FC<ModalProps> = (props) => {
  const navigate = useNavigate();

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const styles = (e.target as HTMLDivElement).classList;
    if (styles.contains(classes["modal"]) || styles.contains(classes["close"]))
      navigate(props.closePath, { replace: false });
  };

  return (
    <div className={classes["modal"]} onClick={closeModal}>
      <div className={classes["content"]}>
        <header>
          <button onClick={() => navigate(-1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrow-back"
              width="2rem"
              height="2rem"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1"></path>
            </svg>
          </button>
          <h2 className="mini-title">{props.title}</h2>
          <button
            onClick={() => navigate(props.closePath, { replace: false })}
            className={classes["close"]}
          >
            &times;
          </button>
        </header>
        <main>{props.children}</main>
      </div>
    </div>
  );
};

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <ModalElement title={props.title} closePath={props.closePath}>
          {props.children}
        </ModalElement>,
        document.getElementById("modal-root")!
      )}
    </React.Fragment>
  );
};

export default Modal;
