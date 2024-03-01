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
        <img
          alt=""
          // border="0"
          src=""
          width="1"
          height="1"
        />
        <button>
          Donate <span className={classes["buttonHeart"]}>&#10084;</span>
        </button>
      </form>
    </div>
  );
};

export default Donate;
