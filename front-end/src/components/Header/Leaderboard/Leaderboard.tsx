import React from "react";
import Modal from "../../../UI/Modal/Modal";
import { Routes, Route, Link } from "react-router-dom";
import LeaderboardTable from "./LeaderboardTable/LeaderboardTable";

const Content: React.FC = () => {
  return (
    <div>
      <Link to="leaderboard/">
        <button>
          Leaderboard <span className="yellow">&#x1F732;</span>
        </button>
      </Link>
    </div>
  );
};

const Auth: React.FC = () => {
  return (
    <>
      <Content />
      <Routes>
        <Route
          path="leaderboard/*"
          element={
            <Modal title={"Leaderboard"} closePath={"/"}>
              <LeaderboardTable>Leaderboard</LeaderboardTable>
            </Modal>
          }
        />
      </Routes>
    </>
  );
};

export default Auth;
