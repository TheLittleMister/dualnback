import React from "react";

import classes from "./Copyright.module.css";

const Copyright: React.FC = () => {
  return (
    <div className={classes["copyright"]}>
      <p className="copyR">
        Copyright &copy;
        <span className="year"></span>. All&nbsp;
        <a
          target="_blank"
          rel="noreferrer"
          href="https://scratch.mit.edu/projects/387535576/"
        >
          Rights&nbsp;
        </a>
        Reserved. Powered by
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.youtube.com/FranklinYulian"
        >
          &nbsp;FY
        </a>
        .
      </p>
    </div>
  );
};

export default Copyright;
