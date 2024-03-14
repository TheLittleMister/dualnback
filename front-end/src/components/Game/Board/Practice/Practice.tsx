import React from "react";

import classes from "./Practice.module.css";

const Practice: React.FC<{
  task: number;
  spatialPlace: number;
  auditoryArr: number[];
  spatialArr: number[];
  spatialMatch: boolean;
  auditoryMatch: boolean;
}> = (props) => {
  const auditoryMap = new Map([
    [1, "h"],
    [2, "j"],
    [3, "k"],
    [4, "l"],
    [5, "q"],
    [6, "r"],
    [7, "s"],
    [8, "t"],
    [9, "g"],
  ]);

  const spatialMap = new Map([
    [1, "↖"],
    [2, "↑"],
    [3, "↗"],
    [4, "←"],
    [5, "•"],
    [6, "→"],
    [7, "↙"],
    [8, "↓"],
    [9, "↘"],
  ]);

  return (
    <div className={classes["practice-span"]}>
      <table>
        <tbody>
          <tr>
            {props.spatialArr.map((item, index, arr) => (
              <td
                key={index}
                className={
                  index === 0 && props.spatialPlace !== 0
                    ? `${classes["span-show"]} ${
                        props.spatialMatch && classes["green"]
                      }`
                    : index === props.task && props.spatialPlace === 0
                    ? `${classes["span-hide"]} ${
                        props.spatialMatch && classes["green"]
                      }`
                    : index === props.task && props.spatialPlace !== 0
                    ? `${classes["span-normal"]} ${
                        props.spatialMatch && classes["green"]
                      }`
                    : classes["span-normal"]
                }
              >
                {spatialMap.get(item)?.toUpperCase()}
              </td>
            ))}
          </tr>
          <tr>
            {props.auditoryArr.map((item, index, arr) => (
              <td
                key={index}
                className={
                  index === 0 && props.spatialPlace !== 0
                    ? `${classes["span-show"]} ${
                        props.auditoryMatch && classes["green"]
                      }`
                    : index === props.task && props.spatialPlace === 0
                    ? `${classes["span-hide"]} ${
                        props.auditoryMatch && classes["green"]
                      }`
                    : index === props.task && props.spatialPlace !== 0
                    ? `${classes["span-normal"]} ${
                        props.auditoryMatch && classes["green"]
                      }`
                    : classes["span-normal"]
                }
              >
                {auditoryMap.get(item)?.toUpperCase()}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Practice;
