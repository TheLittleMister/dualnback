import React from "react";

import HowToPlay from "./HowToPlay/HowToPlay";
import More from "./More/More";

import classes from "./Information.module.css";

const Information: React.FC = () => {
  return (
    <div className={classes["information"]}>
      <HowToPlay />
      <More />
    </div>
  );
};

export default Information;
