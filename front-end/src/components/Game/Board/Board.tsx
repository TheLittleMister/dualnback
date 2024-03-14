import React, {
  useMemo,
  useLayoutEffect,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

import { useLocation } from "react-router-dom";

import h from "../../../assets/sounds/h.wav";
import j from "../../../assets/sounds/j.wav";
import k from "../../../assets/sounds/k.wav";
import l from "../../../assets/sounds/l.wav";
import q from "../../../assets/sounds/q.wav";
import r from "../../../assets/sounds/r.wav";
import s from "../../../assets/sounds/s.wav";
import t from "../../../assets/sounds/t.wav";
import g from "../../../assets/sounds/g.wav";

import Trials from "./Trials/Trials";
import Panel from "./Panel/Panel";
import Keys from "./Keys/Keys";
import Practice from "./Practice/Practice";
import AuthContext from "../../../context/AuthContext";
import {
  urlAPI,
  refreshToken,
  getScore,
  randomInt,
} from "../../../utils/utils";

const Board: React.FC<{
  game: {
    active: boolean;
    practice: boolean;
    task: number;
    trials: number;
  };
  setGame: Dispatch<
    SetStateAction<{
      active: boolean;
      practice: boolean;
      task: number;
      trials: number;
    }>
  >;
  setScore: Dispatch<
    SetStateAction<{
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
    }>
  >;
}> = ({ game, setGame, setScore }) => {
  const { pathname } = useLocation();

  const sounds: {
    [key: number]: HTMLAudioElement;
  } = useMemo(() => {
    return {
      1: new Audio(h),
      2: new Audio(j),
      3: new Audio(k),
      4: new Audio(l),
      5: new Audio(q),
      6: new Audio(r),
      7: new Audio(s),
      8: new Audio(t),
      9: new Audio(g),
    };
  }, []);

  const authCtx = useContext(AuthContext);
  const [spatialPlace, setSpatialPlace] = useState<number>(0);
  const [spatialPressed, setSpatialPressed] = useState<boolean>(false);
  const [spatialMatch, setSpatialMatch] = useState<boolean>(false);

  const [auditoryPressed, setAuditoryPressed] = useState<boolean>(false);
  const [auditoryMatch, setAuditoryMatch] = useState<boolean>(false);

  const [practice, setPractice] = useState<{
    spatial: number[];
    auditory: number[];
  }>({
    spatial: [],
    auditory: [],
  });

  const [trialsCounter, setTrialsCounter] = useState<number>(0);
  const [stopPressed, setStopPressed] = useState<boolean>(false);

  useLayoutEffect(() => {
    let interval: NodeJS.Timer;
    let trialsCounterInterval: number = 0;

    let spatialInput: boolean = false;
    let spatialMatchInterval: boolean = false;
    const spatialArr: number[] = [];
    const spatialObj = {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0,
    };

    let auditoryInput: boolean = false;
    let auditoryMatchInterval: boolean = false;
    const auditoryArr: number[] = [];
    const auditoryObj = {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0,
    };

    // Stop Game Function
    const stopGame = async (
      trials: number,
      spatialObj: {
        TP: number;
        TN: number;
        FP: number;
        FN: number;
      },
      auditoryObj: {
        TP: number;
        TN: number;
        FP: number;
        FN: number;
      }
    ) => {
      setTrialsCounter(0);

      const spatialScore = getScore(
        spatialObj.TP,
        spatialObj.FP,
        spatialObj.FN
      );
      const auditoryScore = getScore(
        auditoryObj.TP,
        auditoryObj.FP,
        auditoryObj.FN
      );

      const scoreData = {
        nback: game.task,
        trials,
        spatialScore,
        auditoryScore,
        totalScore: Number(((spatialScore + auditoryScore) / 2).toFixed(2)),
        spatialObj,
        auditoryObj,
      };

      setScore(scoreData);

      if (
        !game.practice &&
        trials >= game.task * 20 &&
        Boolean(authCtx?.user.username)
      ) {
        const result = await fetch(urlAPI + "score/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx?.user.tokens.access,
          },
          body: JSON.stringify(scoreData),
        });

        // const data = await result.json();

        if (!result.ok) {
          const { refreshed } = await refreshToken(authCtx!);
          if (refreshed) {
            stopGame(trials, spatialObj, auditoryObj);
            return;
          }
        }
      }

      if (game.practice)
        setPractice({
          spatial: [],
          auditory: [],
        });

      setGame((prevGame) => {
        return { ...prevGame, active: false, practice: false };
      });
    };

    const eventHandler = (type: string, code: string, button: number) => {
      if (pathname !== "/") return;

      if (type === "keypress" || type === "mousedown") {
        if (code === "KeyQ") setStopPressed(true);
        if (code === "KeyA" || (button === 0 && code === "game")) {
          if (game.active) spatialInput = true;
          setSpatialPressed(true);
        }
        if (code === "KeyL" || (button === 2 && code === "game")) {
          if (game.active) auditoryInput = true;
          setAuditoryPressed(true);
        }
      } else if (type === "keyup" || type === "mouseup") {
        if (code === "KeyQ") {
          if (game.active)
            stopGame(trialsCounterInterval, spatialObj, auditoryObj);
          setStopPressed(false);
        }
        if (code === "KeyA" || (button === 0 && code === "game"))
          setSpatialPressed(false);

        if (code === "KeyL" || (button === 2 && code === "game"))
          setAuditoryPressed(false);
      }
    };

    const keyHandler = (e: KeyboardEvent) => eventHandler(e.type, e.code, -1);

    const clickHandler = (e: MouseEvent) =>
      eventHandler(
        e.type,
        (e.target as HTMLInputElement).id
          ? (e.target as HTMLInputElement).id
          : (e.target as HTMLInputElement).parentElement!.id
          ? (e.target as HTMLInputElement).parentElement!.id
          : (e.target as HTMLInputElement).parentElement!.parentElement!.id,
        e.button
      );

    const updateScore = (
      match: boolean,
      input: boolean,
      obj: {
        TP: number;
        TN: number;
        FP: number;
        FN: number;
      }
    ) => {
      if (match && input) obj.TP++;
      else if (match && !input) obj.FN++;
      else if (!match && input) obj.FP++;
      else if (!match && !input) obj.TN++;
    };

    if (game.active) {
      interval = setInterval(() => {
        if (trialsCounterInterval > 0) {
          // Update Sensitivity & Specificity (TP, TN, FP, FN)
          updateScore(spatialMatchInterval, spatialInput, spatialObj);
          updateScore(auditoryMatchInterval, auditoryInput, auditoryObj);
        }

        [
          spatialMatchInterval,
          spatialInput,
          auditoryMatchInterval,
          auditoryInput,
        ] = [false, false, false, false];

        // Stop the game if the number of trials is reached
        if (trialsCounterInterval >= game.trials || !game.active)
          stopGame(trialsCounterInterval, spatialObj, auditoryObj);
        else {
          const spatialRandomPlace = randomInt(1, 9);
          const auditoryRandomPlace = randomInt(1, 9);

          // Show Spatial
          setSpatialPlace(spatialRandomPlace);
          spatialArr.unshift(spatialRandomPlace);

          // Sound Auditory
          sounds[auditoryRandomPlace].play();
          auditoryArr.unshift(auditoryRandomPlace);

          //Update Spatial & Auditory Arrays States
          if (game.practice)
            setPractice({
              spatial: [...spatialArr],
              auditory: [...auditoryArr],
            });

          // Check if there are matches
          if (spatialArr.length > game.task) {
            if (spatialArr[0] === spatialArr.slice(-1)[0])
              spatialMatchInterval = true;

            if (auditoryArr[0] === auditoryArr.slice(-1)[0])
              auditoryMatchInterval = true;

            spatialArr.pop();
            auditoryArr.pop();
          }

          // Update class in Keys.tsx
          setSpatialMatch(spatialMatchInterval);
          setAuditoryMatch(auditoryMatchInterval);

          // Update Trials Counter
          trialsCounterInterval++;
          setTrialsCounter(trialsCounterInterval);

          // Remove Spatial Stimuli after 1.5s
          setTimeout(() => setSpatialPlace(0), 1500);
        }
      }, 3000);
    }

    window.addEventListener("mousedown", clickHandler);
    window.addEventListener("mouseup", clickHandler);
    window.addEventListener("keypress", keyHandler);
    window.addEventListener("keyup", keyHandler);
    // Prevent showing right click options
    window.addEventListener("contextmenu", (e: MouseEvent) =>
      e.preventDefault()
    );

    return () => {
      window.removeEventListener("mousedown", clickHandler);
      window.removeEventListener("mouseup", clickHandler);
      window.removeEventListener("keypress", keyHandler);
      window.removeEventListener("keyup", keyHandler);
      window.removeEventListener("contextmenu", (e: MouseEvent) =>
        e.preventDefault()
      );

      clearInterval(interval);
    };
  }, [
    game.active,
    game.task,
    game.trials,
    game.practice,
    setGame,
    setScore,
    sounds,
    authCtx,
    pathname,
  ]);

  return (
    <div className="game-card">
      <Trials
        activeGame={game.active}
        trials={game.trials}
        setGame={setGame}
        trialsCounter={trialsCounter}
        stopPressed={stopPressed}
      />
      <Practice
        task={game.task}
        spatialArr={practice.spatial}
        auditoryArr={practice.auditory}
        spatialPlace={spatialPlace}
        spatialMatch={spatialMatch}
        auditoryMatch={auditoryMatch}
      />
      <Panel spatialPlace={spatialPlace} />
      <Keys
        activeGame={game.active}
        practiceGame={game.practice}
        spatialPressed={spatialPressed}
        spatialMatch={spatialMatch}
        auditoryPressed={auditoryPressed}
        auditoryMatch={auditoryMatch}
      />
    </div>
  );
};

export default Board;
