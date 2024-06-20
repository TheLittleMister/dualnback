import React, { useContext, useEffect, useState } from "react";
import { refreshToken, urlAPI } from "../../../utils/utils";
import AuthContext from "../../../context/AuthContext";

import classes from "./Points.module.css";

const Points: React.FC<{ activeGame: boolean; task: number }> = ({
  activeGame,
  task,
}) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const getPoints = async () => {
      setLoading(true);

      if (!Boolean(authCtx?.user.username)) {
        setPoints(0);
        setLoading(false);
        return;
      }

      const result = await fetch(urlAPI + `points/?task=${task}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx?.user.tokens.access,
        },
      });

      if (result.status === 401) {
        const { refreshed } = await refreshToken(authCtx!);
        if (refreshed) getPoints();
        return;
      }

      const data = await result.json();

      setPoints(data.points);
      setLoading(false);
    };

    if (!activeGame) getPoints();
  }, [authCtx, task, activeGame]);

  return (
    <div>
      {/* <span>{task} Back </span> */}
      {/* <span>Points: </span> */}
      {!Boolean(authCtx?.user.username) ? (
        <span className={classes["red"]}>Log in to save your points</span>
      ) : loading ? (
        <div className="loader"></div>
      ) : (
        <h2 className="mini-title">
          <span className="yellow">{points.toFixed(2)}</span> pts.
        </h2>
      )}
    </div>
  );
};

export default Points;
