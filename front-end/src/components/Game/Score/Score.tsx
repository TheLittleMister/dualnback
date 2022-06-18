import React from "react";

import classes from "./Score.module.css";

const Score: React.FC<{
  score: {
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
  };
}> = ({
  score: {
    nback,
    trials,
    spatialScore,
    auditoryScore,
    totalScore,
    spatialObj,
    auditoryObj,
  },
}) => {
  const spatialTrials = spatialObj.TP + spatialObj.FN;
  const auditoryTrials = auditoryObj.TP + auditoryObj.FN;
  const falsePositives = auditoryObj.FP + spatialObj.FP;
  const trueNegatives =
    trials - (spatialTrials + auditoryTrials + falsePositives);

  return (
    <div className={classes["score"]}>
      <h2 className="mini-title">Stimulus-Response</h2>

      <table className={classes["table"]}>
        <thead>
          <tr>
            <th>{nback}-Back</th>
            <th>Response</th>
            <th>No Response</th>
            <th>Trials</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Spatial</th>
            <td>{spatialObj.TP}</td>
            <td>{spatialObj.FN}</td>
            <td>{spatialTrials}</td>
            <td>{spatialScore}%</td>
          </tr>
          <tr>
            <th>Auditory</th>
            <td>{auditoryObj.TP}</td>
            <td>{auditoryObj.FN}</td>
            <td>{auditoryTrials}</td>
            <td>{auditoryScore}%</td>
          </tr>
          <tr>
            <th>No Stimulus</th>
            <td>{falsePositives}</td>
            <td>{trueNegatives}</td>
            <td>{falsePositives + trueNegatives}</td>
            <td>-</td>
          </tr>
          <tr>
            <th>Total</th>
            <td>{spatialObj.TP + auditoryObj.TP + falsePositives}</td>
            <td>{spatialObj.FN + auditoryObj.FN + trueNegatives}</td>
            <td>{trials}</td>
            <td>{totalScore}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Score;
