import React from "react";

import classes from "./HowToPlay.module.css";

const HowToPlay: React.FC = () => {
  return (
    <div className={classes["howto"]}>
      <h2>How to Play</h2>
      <p>
        If the given stimulus presented is same as any of the
        <strong> N </strong>
        previous:
      </p>
      <ul>
        <li>
          Press '<strong>A</strong>' or
          <strong> L-Click </strong>= <em>Spatial</em>
        </li>
        <li>
          Press '<strong>L</strong>' or
          <strong> R-Click </strong>= <em>Auditory</em>
        </li>
        <li>
          Press '<strong>S</strong>' = <em>Start</em>
        </li>
        <li>
          Press '<strong>P</strong>' = <em>Practice </em>(Max: 12-Back)
        </li>
        <li>
          Press '<strong>Q</strong>' = <em>Stop</em>
        </li>
      </ul>
    </div>
  );
};

export default HowToPlay;
