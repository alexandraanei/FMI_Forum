import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";
import axios from "axios";
import classNames from "classnames";
import { ListItemText, ListItem, Button, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import classes from "./AdminPanel.module.scss";
import AlertStore from "../../Stores/AlertStore";

export default function ThreadItem(props) {
  const { index, setThreads } = props;
  var { thread } = props;
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const userId = user._id;

  const handleDeleteThread = (id) => {
    axios.delete(`/api/thread/${id}`);
    setThreads(id);
    AlertStore.showSnackbar({
      message: "Postarea a fost stearsa.",
      type: "success",
    });
    history.push("/admin");
  };

  const handleApproveThread = async (id) => {
    console.log(thread.userId);
    try {
      await axios.put("/api/thread/approve/" + id);
      setThreads(id);
      AlertStore.showSnackbar({
        message: "Postarea a fost aprobata.",
        type: "success",
      });
      history.push("/admin");
    } catch (err) {
      console.log(err.response.data.message);
    }
    try {
      const data = {
        threadId: thread._id,
        content: "Postarea ta a fost aprobata de catre administrator.",
      };
      const notification = await axios.post("/api/notification/create/", data);
      await axios.put("/api/notification/addtouser/" + thread.userId._id, {
        notificationId: notification.data._id,
      });
      setThreads(id);
      AlertStore.showSnackbar({
        message: "Postarea a fost aprobata.",
        type: "success",
      });
      history.push("/admin");
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <ListItem
      key={index}
      button
      className={classes.thread}
      onClick={() => history.push("/thread/" + thread._id)}
    >
      <ListItemText
        primary={`${thread.title}, in subforumul ${thread.forumId.title}, in forumul ${thread.forumId.categoryId.title}`}
        secondary={`Postat de ${thread.userId.firstName} ${
          thread.userId.lastName
        } in data de ${new Date(thread.createdAt).toLocaleDateString("ro-RO", {
          dateStyle: "full",
          timeStyle: "medium",
        })}`}
      />
      <Tooltip title="Aproba postarea" aria-label="approve">
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classNames(classes.button, classes.approveButton)}
          style={{ marginRight: 5, background: "#76e676" }}
          onClick={(e) => {
            e.stopPropagation();
            handleApproveThread(thread._id);
          }}
        >
          <CheckIcon />
        </Button>
      </Tooltip>
      <Tooltip title="Sterge postarea" aria-label="delete">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          className={classes.button}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteThread(thread._id);
          }}
        >
          <DeleteIcon />
        </Button>
      </Tooltip>
    </ListItem>
  );
}
