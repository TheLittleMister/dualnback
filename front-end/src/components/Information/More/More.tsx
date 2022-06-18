import React from "react";

import classes from "./More.module.css";

const More: React.FC = () => {
  return (
    <div className={classes["more"]}>
      <h2>Information</h2>
      <div>
        <p>
          In
          <strong> n-back task </strong>
          you need to remember
          <strong> n </strong>
          previous
          <em> spatial </em>
          or
          <em> auditory </em>
          stimuli.
        </p>
        <br />
        <p>
          <strong>N-back </strong>
          is a<em> memory test </em>
          where
          <strong> n </strong>
          refers on
          <em>
            &nbsp;how many
            <strong> previous stimuli </strong>
            must be
            <strong> remembered</strong>
          </em>
          .
        </p>

        <p>
          <strong>Dual </strong>
          means that
          <em>
            <strong> verbal auditory </strong>
            stimulus&nbsp;
          </em>
          and
          <em>
            <strong> spatial visual </strong>
            stimulus&nbsp;
          </em>
          are presented&nbsp;
          <strong>at the same time</strong>.
        </p>
        <br />
        <p>
          <strong>Two </strong>
          memory tests are ran
          <em> simultaneously </em>
          and
          <strong> n </strong>
          <em>previous </em>
          <strong>auditory </strong>
          and
          <strong> spatial </strong>
          targets&nbsp;
          <em>
            must be remembered
            <strong> separately</strong>
          </em>
          .&nbsp;
          <a
            target="_blank"
            rel="noreferrer"
            href="https://scholar.google.com/scholar?hl=en&as_sdt=0,5&q=dual+back+training"
          >
            [More]
          </a>
        </p>
      </div>
    </div>
  );
};

export default More;
