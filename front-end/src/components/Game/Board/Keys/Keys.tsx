import React from "react";

import classes from "./Keys.module.css";

const Keys: React.FC<{
  activeGame: boolean;
  practiceGame: boolean;
  spatialPressed: boolean;
  spatialMatch: boolean;
  auditoryPressed: boolean;
  auditoryMatch: boolean;
}> = (props) => {
  return (
    <div className={classes["keys"]}>
      <button
        id="KeyA"
        className={
          props.spatialPressed
            ? !props.activeGame
              ? "button-active"
              : props.spatialMatch
              ? classes["green"]
              : classes["red"]
            : props.practiceGame && props.spatialMatch
            ? classes["blink"]
            : ""
        }
      >
        A: Spatial&nbsp;
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.6rem"
          height="1.6rem"
          viewBox="5 2 20 20"
        >
          <path d="M12.537 2.592l-5.445 3.779c-1.504 1.043-1.877 3.108-.833 4.611l5.668 8.168c1.287 1.855 3.352 2.85 5.451 2.85 3.605 0 6.622-2.919 6.622-6.634 0-1.304-.384-2.621-1.182-3.773l-5.668-8.168c-.644-.927-1.676-1.425-2.726-1.425-.652 0-1.311.192-1.887.592zm.945 1.361c.751-.521 1.784-.334 2.307.416l1.415 2.042-3.912 2.693-2.36-3.403 2.55-1.748zm6.725 15.503c-2.252 1.563-5.356 1.002-6.919-1.25l-3.306-4.764 8.167-5.668 3.308 4.764c1.562 2.252 1.001 5.355-1.25 6.918zm-16.031-11.567l-2.499-1.74.62-.891 2.271 1.582c-.169.332-.3.681-.392 1.049zm.702 4.006l-2.299 1.615-.624-.888 2.414-1.699c.135.338.299.665.509.972zm-.778-1.906h-3.1v-1.085h3.029c-.013.366.005.729.071 1.085z" />
        </svg>
      </button>
      <button
        id="KeyL"
        className={
          props.auditoryPressed
            ? !props.activeGame
              ? "button-active"
              : props.auditoryMatch
              ? classes["green"]
              : classes["red"]
            : props.practiceGame && props.auditoryMatch
            ? classes["blink"]
            : ""
        }
      >
        L: Auditory&nbsp;
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.6rem"
          height="1.6rem"
          viewBox="2 4 20 20"
        >
          <path d="M9.746 4.945l-5.347 3.709c-1.476 1.025-1.843 3.052-.817 4.528l5.564 8.02c1.264 1.821 3.291 2.798 5.352 2.798 3.54 0 6.502-2.866 6.502-6.514 0-1.28-.377-2.573-1.161-3.705l-5.565-8.019c-1.025-1.475-3.052-1.842-4.528-.817zm-4.419 5.046l2.773-1.978 2.317 3.341-4.107 2.906-1.392-2.005c-.513-.736-.328-1.753.409-2.264zm11.949 11.51c-2.211 1.535-5.259.984-6.793-1.227l-3.245-4.678 8.018-5.565 3.247 4.678c1.533 2.211.982 5.258-1.227 6.792zm-6.094-18.781l.002-2.72 1.079.001-.003 2.735c-.217-.029-.436-.047-.658-.047l-.42.031zm2.115.272l1.579-2.25.883.62-1.488 2.119c-.305-.197-.631-.363-.974-.489zm-4.191.395l-1.421-2.033.885-.618 1.53 2.19c-.347.112-.677.273-.994.461z" />
        </svg>
      </button>
    </div>
  );
};

export default Keys;
