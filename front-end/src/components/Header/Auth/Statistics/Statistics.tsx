import React, { useContext, useState, useRef, useEffect } from "react";

import StatisticsChart from "./Chart/StatisticsChart";

import AuthContext from "../../../../context/AuthContext";
import Form from "../../../../UI/Form/Form";
import classes from "./Statistics.module.css";
import {
  urlAPI,
  refreshToken,
  prettyDate,
  colorScheme,
} from "../../../../utils/utils";

const Statistics: React.FC = () => {
  const [stats, setStats] = useState({
    data: false,
    n: 0,
    sets: 0,
    trials: 0,
    spatial: 0,
    auditory: 0,
    total: 0,
    lists: {
      created_list: [],
      trials_list: [],
      spatial_list: [],
      auditory_list: [],
      total_list: [],
    },
  });
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const formSubmitButtonRef = useRef<HTMLButtonElement>(null);

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const tomorrow = today.toISOString().split("T")[0];

  let statsFormData = {
    n: 2,
    sets: 3,
  };

  if (localStorage.getItem("statsForm"))
    statsFormData = JSON.parse(localStorage.getItem("statsForm")!);

  const [statsForm, setStatsForm] = useState(statsFormData);

  const statisticsFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!Boolean(authCtx?.user.username)) {
      setLoading(false);
      return;
    }

    const dataArr = [...new FormData(e.target as HTMLFormElement)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + "statistics/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authCtx?.user.tokens.access,
      },
      body: JSON.stringify(dataObj),
    });

    const data = await result.json();

    if (!result.ok) {
      const { refreshed } = await refreshToken(authCtx!);
      if (refreshed) statisticsFormHandler(e);
      return;
    }

    data.lists.created_list.forEach(
      (item: string, index: number) =>
        (data.lists.created_list[index] = [
          prettyDate(item),
          ` (${data.lists.trials_list[index]} trials)`,
        ])
    );

    setStats(data);
    setStatsForm({
      n: data.n,
      sets: data.sets,
    });
    setLoading(false);
  };

  useEffect(() => {
    formSubmitButtonRef.current && formSubmitButtonRef.current.click();
  }, []);

  const selectFormHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatsForm((prevState) => {
      const newState = {
        ...prevState,
        sets: +e.target.value,
      };

      localStorage.setItem("statsForm", JSON.stringify(newState));
      return newState;
    });
  };

  const nInputFormHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatsForm((prevState) => {
      const newState = {
        ...prevState,
        n: +e.target.value,
      };

      localStorage.setItem("statsForm", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className={classes["statistics-div"]}>
      <StatisticsChart stats={stats.lists} />
      <div className={classes["statistics-form"]}>
        <Form
          onSubmit={statisticsFormHandler}
          messages={[]}
          loading={loading}
          success={false}
          ref={formSubmitButtonRef}
          submitText={"Check Statistics"}
        >
          <div>
            <label htmlFor="n-back">N:</label>
            <input
              type="number"
              value={statsForm.n}
              onChange={nInputFormHandler}
              name="n"
              maxLength={100}
              id="nback"
              style={{ width: "6rem" }}
            />
          </div>
          <div>
            <label htmlFor="sets">Last</label>
            <select
              id="sets"
              name="sets"
              onChange={selectFormHandler}
              value={statsForm.sets}
            >
              <option value="1">10</option>
              <option value="2">20</option>
              <option value="3">40</option>
              <option value="4">80</option>
              <option value="5">160</option>
            </select>
            <span>sets</span>
          </div>
          <div>
            <label htmlFor="stats-date">Date:</label>
            <input
              type="date"
              id="stats-date"
              name="date"
              defaultValue={tomorrow}
              max={tomorrow}
              style={colorScheme()}
            />
          </div>
        </Form>

        <div className={classes["statistics-info"]}>
          <table>
            <tbody>
              <tr>
                <th>N-Back</th>
                <td className="stats-n-back">{stats.n}</td>
              </tr>
              <tr>
                <th>Trials</th>
                <td className="stats-trials">{stats.trials}</td>
              </tr>
              <tr>
                <th>Spatial</th>
                <td className="stats-spatial">{stats.spatial}</td>
              </tr>
              <tr>
                <th>Auditory</th>
                <td className="stats-auditory">{stats.auditory}</td>
              </tr>
              <tr>
                <th>Total</th>
                <td className="stats-total">{stats.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={classes["info-sets"]}>
        <div>
          The set is taken into account if it is NOT practice and it has at
          least <strong>N &times; 20</strong> trials.
          <br />
          <br />
          <div className={classes["eg"]}>
            <h4>e.g:</h4>
            <ul>
              <li>For 2-Back, the minimum trial count is 40. </li>
              <li>For 7-Back, the minimum trial count is 140. </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
