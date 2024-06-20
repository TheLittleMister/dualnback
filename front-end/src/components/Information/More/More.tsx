import React from "react";

import classes from "./More.module.css";

const More: React.FC = () => {
  return (
    <div className={classes["more"]}>
      <h2>Information</h2>
      <div>
        <p>
          <strong>
            Dual N<span className="yellow">-</span>Back
          </strong>{" "}
          is a memory game requiring you to simultaneously remember the previous
          N auditory and spatial stimuli targets separately.
        </p>
        <br />
        <p>
          <strong>N</strong> refers to the number of previous stimuli that must
          be remembered.
        </p>
        <br />
        <p>
          <strong>Dual</strong> means that verbal auditory and spatial visual
          stimuli are presented at the same time.{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://scholar.google.com/scholar?hl=en&as_sdt=0,5&q=dual+back+training"
          >
            [More]
          </a>
        </p>
        <br />
      </div>
    </div>
  );
};

export default More;
