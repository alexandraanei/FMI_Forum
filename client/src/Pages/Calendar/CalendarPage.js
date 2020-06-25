import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { List, Divider, Button } from "@material-ui/core";
import { Calendar, Badge } from 'antd';
import classes from './CalendarPage.module.scss';

export default function CalendarPage() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const id = user._id;
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    getDeadlines();
  }, []);

  const getDeadlines = async () => {
    const data = { user }
    try {
      const response = await axios.get("/api/thread/deadlines/" + id);
      setDeadlines(response.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const getListData = (value) => {
    let listData;
    console.log(value);
    console.log(deadlines);
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'error', content: 'This is warning event.' },
          { type: 'error', content: 'This is usual event.' },
        ];
        break;
      case 10:
        listData = [
          { type: 'error', content: 'This is error event.' },
        ];
        break;
      
      default:
    }
    return listData || [];
  }
  
  const dateCellRender = value => {
    const listData = getListData(value);
    return (
      <ul className={classes.events}>
        {listData.map(item => (
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
      
      <Calendar dateCellRender={dateCellRender} />
      
    </div>
  );
}
