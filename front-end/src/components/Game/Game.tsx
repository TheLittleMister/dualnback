import React, { useEffect, useState } from "react";

import classes from "./Game.module.css";

import Task from "./Task/Task";
import Board from "./Board/Board";
import Score from "./Score/Score";

const Game: React.FC = () => {
  const [game, setGame] = useState<{
    active: boolean;
    practice: boolean;
    task: number;
    trials: number;
  }>({
    active: false,
    practice: false,
    task: 2,
    trials: 100,
  });

  const [score, setScore] = useState<{
    nback: number;
    trials: number;
    spatialScore: number;
    auditoryScore: number;
    totalScore: number;
    spatialObj: {
      TP: number;
      TN: number;
      FP: number;
      FN: number;
    };
    auditoryObj: {
      TP: number;
      TN: number;
      FP: number;
      FN: number;
    };
  }>({
    nback: 0,
    trials: 0,
    spatialScore: 0,
    auditoryScore: 0,
    totalScore: 0,
    spatialObj: {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0,
    },
    auditoryObj: {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0,
    },
  });

  useEffect(() => {
    if (localStorage.getItem("task"))
      setGame((prevState) => {
        return { ...prevState, task: Number(localStorage.getItem("task")) };
      });

    if (localStorage.getItem("trials"))
      setGame((prevState) => {
        return { ...prevState, trials: Number(localStorage.getItem("trials")) };
      });
  }, []);

  return (
    <main id="playableClicks" className={classes["game"]}>
      <Task activeGame={game.active} task={game.task} setGame={setGame} />
      <Board game={game} setGame={setGame} setScore={setScore} />
      <Score score={score} />
    </main>
  );
};

export default Game;
