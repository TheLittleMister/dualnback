import React from "react";

import classes from "./Panel.module.css";

const Panel: React.FC<{
  spatialPlace: number;
}> = (props) => {
  return (
    <div id="playableClicks" className={classes["panel"]}>
      <div className={classes["row-1"]}>
        <div
          className={`${classes["circle"]} ${
            props.spatialPlace === 1 && classes["fill"]
          }`}
        ></div>
        <div
          className={`${classes["circle"]} ${
            props.spatialPlace === 2 && classes["fill"]
          }`}
        ></div>
        <div
          className={`${classes["circle"]} ${
            props.spatialPlace === 3 && classes["fill"]
          }`}
        ></div>
      </div>
      <div className={classes["row-2"]}>
        <div
          className={`${classes["circle"]} ${
            props.spatialPlace === 4 && classes["fill"]
          }`}
        ></div>
        <div
          className={`${classes["circle"]} ${
            props.spatialPlace === 5 && classes["fill"]
          }`}
        ></div>
        <div
          className={`${classes["circle"]} ${
            props.spatialPlace === 6 && classes["fill"]
          }`}
        ></div>
      </div>
      <div className={classes["row-3"]}>
        <div
          className={`${classes["circle"]} ${
            props.spatialPlace === 7 && classes["fill"]
          }`}
        ></div>
        <div
          className={`${classes["circle"]} ${
            props.spatialPlace === 8 && classes["fill"]
          }`}
        ></div>
        <div
          className={`${classes["circle"]} ${
            props.spatialPlace === 9 && classes["fill"]
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Panel;
