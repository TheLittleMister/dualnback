import React from "react";

import classes from "./Title.module.css";

const Title: React.FC = () => {
  return (
    <div>
      <h1 className={classes["h1-desktop"]}>
        Dual
        <span>&nbsp;N</span>
        <span className="yellow">-</span>Back
      </h1>
      <h1 className={classes["h1-mobile"]}>
        D<span>&nbsp;N</span>
        <span className="yellow">-</span>B
      </h1>
    </div>
  );
};

export default Title;
