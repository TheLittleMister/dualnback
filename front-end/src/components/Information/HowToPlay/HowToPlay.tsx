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
          <strong>
            {" "}
            L<span className="yellow">-</span>Click{" "}
          </strong>
          = Spatial
        </li>
        <li>
          Press '<strong>L</strong>' or
          <strong>
            {" "}
            R<span className="yellow">-</span>Click{" "}
          </strong>
          = Auditory
        </li>
        <li>
          Press '<strong>S</strong>' = Start
        </li>
        <li>
          Press '<strong>P</strong>' = Practice <em>(Max: 12-Back)</em>
        </li>
        <li>
          Press '<strong>Q</strong>' = Stop
        </li>
      </ul>
    </div>
  );
};

export default HowToPlay;
