import React from "react";

import classes from "./Footer.module.css";

import Social from "./Social/Social";
import Copyright from "./Copyright/Copyright";
import Donate from "./Donate/Donate";

const Footer: React.FC = () => {
  return (
    <div className={classes["footer"]}>
      <Social />
      <Copyright />
      <Donate />
    </div>
  );
};

export default Footer;
