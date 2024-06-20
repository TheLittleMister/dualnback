import React from "react";

import classes from "./Score.module.css";
import { Link, Route, Routes } from "react-router-dom";
import PrivateRoute from "../../../utils/PrivateRoute";
import Modal from "../../../UI/Modal/Modal";
import Statistics from "./Statistics/Statistics";

const Content: React.FC<{
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <h2 className="mini-title">
          Stimulus<span className="yellow">-</span>Response
        </h2>
        <Link to="statistics/">
          <button style={{ height: "fit-content" }}>
            Statistics <span className="yellow">&#x2b5c;</span>
          </button>
        </Link>
      </div>

      <table className="table">
        <thead id="playableClicks">
          <tr>
            <th>
              {nback}
              <span className="yellow">-</span>Back
            </th>
            <th>Response</th>
            <th>No Response</th>
            <th>Trials</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody id="playableClicks">
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
            <td className="yellow">{totalScore}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

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
}> = ({ score }) => {
  return (
    <>
      <Content score={score} />
      <Routes>
        <Route element={<PrivateRoute redirectPath={"/login"} />}>
          <Route
            path="statistics/"
            element={
              <Modal title={"Statistics"} closePath={"/"}>
                <Statistics />
              </Modal>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default Score;
