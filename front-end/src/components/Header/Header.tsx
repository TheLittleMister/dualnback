import React from "react";
import classes from "./Header.module.css";

import Switch from "./Switch/Switch";
import Title from "./Title/Title";
import Auth from "./Auth/Auth";

const Header: React.FC = () => {
  return (
    <header className={classes["header"]}>
      <Switch />
      <Title />
      <Auth />
    </header>
  );
};

export default Header;
