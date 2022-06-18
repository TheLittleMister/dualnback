import React from "react";
import classes from "./Donate.module.css";

const Donate: React.FC = () => {
  return (
    <div className={classes["donate"]}>
      <form
        action="https://www.paypal.com/donate"
        method="post"
        target="_blank"
      >
        <input type="hidden" name="hosted_button_id" value="P9NTAKLCA6ZLW" />
        <input
          className={classes["input"]}
          type="image"
          src="https://i0.wp.com/slca-ctp.org/wp-content/uploads/2016/09/Donate-Button.png"
          // border="0"
          name="submit"
          title="Donate to Dual N-Back"
          alt="Donate to Dual N-Back"
        />
        <img
          alt=""
          // border="0"
          src=""
          width="1"
          height="1"
        />
      </form>
    </div>
  );
};

export default Donate;
