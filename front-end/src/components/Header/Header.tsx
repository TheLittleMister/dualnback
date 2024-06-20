import React from "react";
import classes from "./Header.module.css";

import Switch from "./Switch/Switch";
import Title from "./Title/Title";
import Auth from "./Auth/Auth";
import Leaderboard from "./Leaderboard/Leaderboard";

const Header: React.FC = () => {
  return (
    <header className={classes["header"]}>
      <Switch />
      <Leaderboard />
      <Title />
      <Auth />
    </header>
  );
};

export default Header;
