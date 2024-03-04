import React, { Dispatch, SetStateAction } from "react";

import classes from "./Trials.module.css";

const Trials: React.FC<{
  activeGame: boolean;
  stopPressed: boolean;
  trials: number;
  trialsCounter: number;
  setGame: Dispatch<
    SetStateAction<{
      active: boolean;
      practice: boolean;
      task: number;
      trials: number;
    }>
  >;
}> = (props) => {
  const changeTrialsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredTrials = +e.currentTarget.value;

    if (
      Number.isNaN(enteredTrials) ||
      !Number.isFinite(enteredTrials) ||
      +enteredTrials < 0 ||
      +enteredTrials > 999
    )
      return;

    props.setGame((prevGame) => {
      return {
        ...prevGame,
        trials: enteredTrials,
      };
    });

    localStorage.setItem("trials", String(enteredTrials));
  };

  return (
    <div className={classes["game"]}>
      <div className={classes["clock"]}>
        <div
          className={`${classes["hour"]} ${
            props.activeGame && classes["hour-spin"]
          }`}
        >
          <div className={classes["white"]}></div>
          <div className={classes["dark"]}></div>
        </div>
      </div>
      <span
        className={props.activeGame ? classes["green-dot"] : classes["red-dot"]}
      ></span>
      <form action="#" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
        <label htmlFor="trials-input" className={classes["trials"]}>
          {props.trialsCounter} /&nbsp;
        </label>
        <input
          onChange={changeTrialsHandler}
          type="number"
          id="trials-input"
          name="quantity"
          min="0"
          max="999"
          value={props.trials}
          className={classes["input"]}
          disabled={props.activeGame ? true : false}
        />
      </form>
      <button id="KeyQ" className={props.stopPressed ? "button-active" : ""}>
        Q: Stop
      </button>
    </div>
  );
};

export default Trials;
