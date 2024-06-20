import React from "react";

import classes from "./Points.module.css";

const Points: React.FC = () => {
  return (
    <div className={classes["points"]}>
      <h2>Points</h2>
      <p>
        <strong>Recent scores</strong> have a greater impact on your points,
        while older scores contribute less.
      </p>
      <p>
        Your points increase with the <strong>number of trials</strong> you
        played per session to achieve each score.
      </p>
      <p>
        Only the <strong>number of sessions</strong> you have played in{" "}
        <strong>the last 12 months</strong> contribute to your points.
      </p>
    </div>
  );
};

export default Points;
