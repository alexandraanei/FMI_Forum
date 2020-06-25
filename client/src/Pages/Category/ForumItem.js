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
import classes from "./ForumItem.module.scss";
import AlertStore from "../../Stores/AlertStore";

export default function ForumItem(props) {
  const { user } = useContext(AuthContext);
  var { forum } = props;
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [forumName, setForumName] = useState("");

  const handleDeleteForum = () => {
    axios.delete(`/api/forum/${forum._id}`);
    AlertStore.showSnackbar({
      message: "Forum sters cu succes.",
      type: "success",
    });
    history.push(`/category/${forum.categoryId}`);
  };

  const handleEditForum = async (id) => {
    setIsEditing(false);
    forum.title = forumName === "" ? forum.title : forumName;
    try {
      await axios.put("/api/forum/" + id + "/edit", { title: forum.title });
      AlertStore.showSnackbar({
        message: "Forum editat cu succes.",
        type: "success",
      });
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleEditForumInput = (id) => {
    setIsEditing(true);
  };

  const handleSubscribe = async (id) => {
    try {
      await axios.put(`/api/user/subscribeforum/${user._id}`, {
        forum: id,
      });
      AlertStore.showSnackbar({
        message: "Te-ai abonat cu succes.",
        type: "success",
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
      AlertStore.showSnackbar({
        message: "Te-ai dezabonat cu succes.",
        type: "success",
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push("/category");
  };

  return (
    <ListItem
      button={!isEditing}
      className={classes.forum}
      onClick={
        !isEditing ? () => history.push(`/forum/${forum._id}`) : () => {}
      }
    >
      <ListItemText
        primary={
          isEditing ? (
            <TextField
              id="margin-none"
              defaultValue={forum.title}
              onChange={(e) => setForumName(e.target.value)}
              helperText="Schimba nume"
            />
          ) : (
            forum.title
          )
        }
        secondary={new Date(forum.createdAt).toLocaleDateString('ro-RO', { dateStyle: 'full', timeStyle: 'medium' })}
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
                    handleEditForum(forum._id);
                  }
                : (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditForumInput(forum._id);
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
              handleDeleteForum(forum._id);
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
          </Tooltip>
        </React.Fragment>
      )}
    </ListItem>
  );
}
