import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { List, Divider, Button } from "@material-ui/core";
import { Calendar, Badge } from "antd";
import classes from "./CalendarPage.module.scss";

export default function CalendarPage() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const id = user._id;
  const [threadsWithDeadline, setThreadsWithDeadline] = useState([]);

  useEffect(() => {
    getThreadsWithDeadline();
  }, []);

  const getThreadsWithDeadline = async () => {
    try {
      const response = await axios.get("/api/thread/deadlines/" + id);
      setThreadsWithDeadline(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const yyyymmdd = (date) => {
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    return (
      date.getFullYear() +
      "-" +
      (mm > 9 ? "" : "0") +
      mm +
      "-" +
      (dd > 9 ? "" : "0") +
      dd
    );
  };

  function getListData(value) {
    let listData = [];
    const calendarDate = yyyymmdd(value._d);
    console.log(threadsWithDeadline)

    threadsWithDeadline.forEach(thread => {
      if(thread.deadline === calendarDate)
      listData.push({ type: "error", content: thread.title })
    });
    return listData || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className={classes.events}>
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Calendar</h1>

      <Calendar
        dateCellRender={dateCellRender}
      />
    </div>
  );
}
