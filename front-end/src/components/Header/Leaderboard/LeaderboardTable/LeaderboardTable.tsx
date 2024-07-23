import React, { useState, useEffect } from "react";

import classes from "./LeaderboardTable.module.css";
import { urlAPI } from "../../../../utils/utils";

const LeaderboardTable: React.FC<{}> = () => {
  let defaultN = 2;

  if (localStorage.getItem("leaderboardForm"))
    defaultN = parseInt(JSON.parse(localStorage.getItem("leaderboardForm")!));

  const [n, setN] = useState(defaultN);
  const [loading, setLoading] = useState<boolean>(false);

  const [leaderboard, setLeaderboard] = useState<
    {
      points: number;
      user__username: string;
    }[]
  >([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      setLoading(true);

      const result = await fetch(urlAPI + `leaderboard/?n=${n}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await result.json();

      setLeaderboard(data.points);
      setLoading(false);
    };

    const updateLeaderboard = async () => {
      // const result = ...
      await fetch(urlAPI + `updateLeaderboard/?n=${n}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // const data = await result.json();
    };

    getLeaderboard();
    updateLeaderboard();
  }, [n]);

  // const nInputFormHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let task = +e.target.value;

  //   if (task < 1) task = 1;
  //   else if (task > 99) task = 99;

  //   setN(task);
  //   localStorage.setItem("leaderboardForm", JSON.stringify(task));
  // };

  const upTask = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).style.borderBottomColor = "var(--yellow)";

    setN((prevN) => {
      const newState = prevN < 99 ? prevN + 1 : 99;
      localStorage.setItem("leaderboardForm", JSON.stringify(newState));
      return newState;
    });
  };

  const downTask = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).style.borderTopColor = "var(--yellow)";

    setN((prevN) => {
      const newState = prevN > 1 ? prevN - 1 : 1;
      localStorage.setItem("leaderboardForm", JSON.stringify(newState));
      return newState;
    });
  };

  const arrowMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).style.borderBottomColor = "var(--main-color)";
    (e.target as HTMLElement).style.borderTopColor = "var(--main-color)";
  };

  return (
    <div className={classes["leaderboard"]}>
      {loading ? (
        <div className="loader"></div>
      ) : (
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
            <span>{n}</span>
            <span className="yellow">-</span>Back
          </h2>
        </div>
      )}

      <br />

      <table className="table">
        <thead id="playableClicks">
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody id="playableClicks">
          {leaderboard.map((user, index) => (
            <tr key={index}>
              <th>#{index + 1}</th>
              <td>
                {user.user__username.length! > 14
                  ? user.user__username.slice(0, 11) + "..."
                  : user.user__username}
              </td>
              <td>{user.points.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
