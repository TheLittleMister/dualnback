import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";

import { useLocation } from "react-router-dom";

import classes from "./Task.module.css";

const Task: React.FC<{
  activeGame: boolean;
  task: number;
  setGame: Dispatch<
    SetStateAction<{
      active: boolean;
      practice: boolean;
      task: number;
      trials: number;
    }>
  >;
}> = ({ activeGame, task, setGame }) => {
  const { pathname } = useLocation();

  const [startPressed, setStartPressed] = useState<boolean>(false);
  const [practicePressed, setPracticePressed] = useState<boolean>(false);
  const [showPracticeMessage, setShowPracticeMessage] =
    useState<boolean>(false);

  const startGame = useCallback(() => {
    setShowPracticeMessage(false);
    if (!activeGame)
      setGame((prevGame) => {
        return {
          ...prevGame,
          active: true,
        };
      });
  }, [activeGame, setGame]);

  const practiceGame = useCallback(() => {
    setShowPracticeMessage(false);
    if (!activeGame) {
      if (task < 13)
        setGame((prevGame) => {
          return {
            ...prevGame,
            active: true,
            practice: true,
          };
        });
      else setShowPracticeMessage(true);
    }
  }, [activeGame, setGame, task]);

  const upTask = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).style.borderBottomColor = "var(--yellow)";
    if (!activeGame)
      setGame((prevGame) => {
        const newState = {
          ...prevGame,
          task: prevGame.task < 99 ? prevGame.task + 1 : 99,
        };

        localStorage.setItem("task", String(newState.task));
        return newState;
      });
  };

  const downTask = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).style.borderTopColor = "var(--yellow)";
    if (!activeGame)
      setGame((prevGame) => {
        const newState = {
          ...prevGame,
          task: prevGame.task > 1 ? prevGame.task - 1 : 1,
        };

        localStorage.setItem("task", String(newState.task));
        return newState;
      });
  };

  const arrowMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).style.borderBottomColor = "var(--main-color)";
    (e.target as HTMLElement).style.borderTopColor = "var(--main-color)";
  };

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (pathname !== "/") return;

      if (e.type === "keypress") {
        if (e.code === "KeyS") {
          setStartPressed(true);
          startGame();
        } else if (e.code === "KeyP") {
          setPracticePressed(true);
          practiceGame();
        }
      } else if (e.type === "keyup") {
        if (e.code === "KeyS") setStartPressed(false);
        else if (e.code === "KeyP") setPracticePressed(false);
      }
    };

    window.addEventListener("keypress", keyHandler);
    window.addEventListener("keyup", keyHandler);

    return () => {
      window.removeEventListener("keypress", keyHandler);
      window.removeEventListener("keyup", keyHandler);
    };
  }, [startGame, practiceGame, pathname]);

  return (
    <div className={classes["task"]}>
      <div className={classes["arrows-task"]}>
        <div
          className={classes["up"]}
          onMouseDown={upTask}
          onMouseUp={arrowMouseUp}
        ></div>
        <div
          className={classes["down"]}
          onMouseDown={downTask}
          onMouseUp={arrowMouseUp}
        ></div>
      </div>
      <h2 className="mini-title">
        <span>{task}</span>
        <span className="yellow">-</span>Back
      </h2>
      <div className={classes["play"]}>
        <button
          id="KeyS"
          onClick={startGame}
          onMouseDown={() => setStartPressed(true)}
          onMouseUp={() => setStartPressed(false)}
          className={startPressed ? "button-active" : ""}
        >
          S: Start
        </button>
        <button
          id="KeyP"
          onClick={practiceGame}
          onMouseDown={() => setPracticePressed(true)}
          onMouseUp={() => setPracticePressed(false)}
          className={practicePressed ? "button-active" : ""}
        >
          P: Practice
          {showPracticeMessage && (
            <span className={classes["red"]}>
              <br />
              Max: 12-Back
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Task;
