import React, { useEffect, useRef } from "react";
import classes from "./Switch.module.css";

const Switch: React.FC = () => {
  const switchRef = useRef<HTMLInputElement>(null);

  const switchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      document.documentElement.style.setProperty("--main-bg-color", "#e9e9ea");
      document.documentElement.style.setProperty("--main-color", "#383d43");

      localStorage.setItem("light", "1");
    } else {
      document.documentElement.style.setProperty("--main-bg-color", "#1f2329");
      document.documentElement.style.setProperty("--main-color", "#bdbec0");
      localStorage.setItem("light", "0");
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("light") &&
      Boolean(Number(localStorage.getItem("light")))
    )
      switchRef.current && switchRef.current.click();
    else localStorage.setItem("light", "0");
  }, []);

  return (
    <div>
      <label className={classes["switch"]}>
        <input
          type="checkbox"
          className={classes["input"]}
          onChange={switchHandler}
          ref={switchRef}
        />
        <span className={`${classes["slider"]} ${classes["round"]}`}></span>
      </label>
    </div>
  );
};

export default Switch;
