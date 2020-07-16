import React, { useState, useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  ListItemText,
  ListItem,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import StarIcon from "@material-ui/icons/Star";
import classes from "./ThreadItem.module.scss";
import AlertStore from "../../Stores/AlertStore";

export default function ThreadItem(props) {
  const { user } = useContext(AuthContext);
  var { thread, pinned, removeFixedThread, addFixedThread } = props;
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [threadName, setThreadName] = useState("");
  const [subscribed, setSubscribed] = useState(user?.subscribedThreads.includes(thread._id));

  const handleDeleteThread = () => {
    axios.delete(`/api/thread/${thread._id}`);
    AlertStore.showSnackbar({
      message: "Postarea a fost stearsa.",
      type: "success",
    });
    history.push(`/forum/${thread.forumId}`);
  };

  const handlePinThread = async () => {
    try {
      await axios.put(`/api/forum/addtopinned/${thread.forumId}`, {
        thread: thread._id,
      });
      addFixedThread(thread);
      AlertStore.showSnackbar({
        message: "Postarea a fost fixata.",
        type: "success",
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push(`/forum/${thread.forumId}`);
  };

  const handleUnpinThread = async () => {
    try {
      await axios.put(`/api/forum/removepinned/${thread.forumId}`, {
        thread: thread._id,
      });
      removeFixedThread(thread);
      AlertStore.showSnackbar({
        message: "Postarea a fost stearsa dintre cele fixate.",
        type: "success",
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push(`/forum/${thread.forumId}`);
  };

  const handleEditThread = async (id) => {
    setIsEditing(false);
    thread.title = threadName === "" ? thread.title : threadName;
    try {
      await axios.put("/api/thread/" + id + "/edit", { title: thread.title });
      AlertStore.showSnackbar({
        message: "Titlul postarii a fost modificat.",
        type: "success",
      });
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleEditThreadInput = (id) => {
    setIsEditing(true);
  };

  const handleSubscribe = async (id) => {
    try {
      await axios.put(`/api/user/subscribepost/${user._id}`, {
        post: id,
      });
      setSubscribed(true);
      AlertStore.showSnackbar({
        message: "Te-ai abonat cu succes.",
        type: "success",
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push(`/forum/${thread.forumId}`);
  };

  const handleUnsubscribe = async (id) => {
    try {
      await axios.put(`/api/user/unsubscribepost/${user._id}`, {
        post: id,
      });
      setSubscribed(false);
      AlertStore.showSnackbar({
        message: "Te-ai dezabonat cu succes.",
        type: "success",
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push(`/forum/${thread.forumId}`);
  };

  return (
    <ListItem
      button={!isEditing}
      className={classes.thread}
      onClick={
        !isEditing ? () => history.push(`/thread/${thread._id}`) : () => {}
      }
    >
      <ListItemText
        primary={
          isEditing ? (
            <TextField
              id="margin-none"
              defaultValue={thread.title}
              onChange={(e) => setThreadName(e.target.value)}
              helperText="Schimba nume"
            />
          ) : (
            thread.title
          )
        }
        secondary={`Postat de ${thread.userId.firstName} ${thread.userId.lastName} in data de ${new Date(thread.createdAt).toLocaleDateString('ro-RO', { dateStyle: 'full', timeStyle: 'medium' })}`}
      />
      {(user?.type === "admin" || user?.type === "mod") && (
        <React.Fragment>
          <Button
            variant="contained"
            className={classes.button}
            startIcon={<StarIcon />}
            style={{ marginRight: 4 }}
            onClick={
              pinned
                ? (e) => {
                    e.stopPropagation();
                    handleUnpinThread(thread._id);
                  }
                : (e) => {
                    e.stopPropagation();
                    handlePinThread(thread._id);
                  }
            }
          >
            {pinned ? "Sterge" : "Marcheaza"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            style={{ marginRight: 4 }}
            startIcon={<CreateIcon />}
            onClick={
              isEditing
                ? (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditThread(thread._id);
                  }
                : (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditThreadInput(thread._id);
                  }
            }
          >
            {isEditing ? "Ok" : "Redenumeste"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteThread(thread._id);
            }}
          >
            Sterge
          </Button>
        </React.Fragment>
      )}
      {user?.type === 'user' && (
        <React.Fragment>
          <Tooltip
            title={
              subscribed
                ? "Dezaboneaza-te"
                : "Aboneaza-te"
            }
            aria-label="subscribe"
          >
            <IconButton
              variant="contained"
              className={classes.button}
              color={
                subscribed
                  ? "primary"
                  : "default"
              }
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                subscribed
                  ? handleUnsubscribe(thread._id)
                  : handleSubscribe(thread._id);
              }}
            >
              <AddAlertIcon />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      )}
    </ListItem>
  );
}
