import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import classes from "./BrowseCategories.module.scss";

export default function RenderCategory(props) {
  const history = useHistory();
  const [fora, setFora] = useState([]);
  const { user } = useContext(AuthContext);
  const { id } = props;

  useEffect(() => {
    getFora();
  });

  const getFora = async () => {
    const response = await axios.get("/api/forum/category/" + id);
    setFora(response.data);
  };

  const handleSubscribe = async (id) => {
    try {
      await axios.put(`/api/user/subscribeforum/${user._id}`, {
        forum: id,
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push("/category");
  };

  const handleUnsubscribe = async (id) => {
    try {
      await axios.put(`/api/user/unsubscribeforum/${user._id}`, {
        forum: id,
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push("/category");
  };

  return (
    <List style={{ width: '100%' }}>
      {fora.map((forum) => (
        <ListItem
          key={forum._id}
          button
          className={classes.panel}
          onClick={() => history.push(`/forum/${forum._id}`)}
        >
          <ListItemText primary={forum.title} />
          <div style={{ flexGrow: 1 }} />
          {user && (<Tooltip
            title={
              user?.subscribedForums.includes(forum._id)
              ? "Dezaboneaza-te"
              : "Aboneaza-te"
            }
            aria-label="subscribe"
          >
            <IconButton
              variant="contained"
              className={classes.button}
              color={
                user?.subscribedForums.includes(forum._id)
                  ? "primary"
                  : "default"
              }
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                user?.subscribedForums.includes(forum._id)
                  ? handleUnsubscribe(forum._id)
                  : handleSubscribe(forum._id);
              }}
            >
              <AddAlertIcon />
            </IconButton>
          </Tooltip>)}
        </ListItem>
      ))}
    </List>
  );
}
