import React, { useState, useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ListItemText, ListItem, Button, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import classes from "./ThreadItem.module.scss";

export default function ThreadItem(props) {
  const { user } = useContext(AuthContext);
  var { thread } = props;
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [threadName, setThreadName] = useState("");

  const handleDeleteThread = () => {
    axios.delete(`/api/thread/${thread._id}`);
    history.push(`/forum/${thread.forumId}`);
  };

  const handleEditThread = async (id) => {
    setIsEditing(false);
    thread.title = threadName === "" ? thread.title : threadName;
    try {
      await axios.put("/api/thread/" + id + "/edit", { title: thread.title });
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleEditThreadInput = (id) => {
    setIsEditing(true);
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
        secondary={new Date(thread.createdAt).toUTCString()}
      />
      {user?.type === "admin" && (
        <React.Fragment>
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
    </ListItem>
  );
}