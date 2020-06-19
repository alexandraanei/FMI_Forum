import React, { useState, useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ListItemText, ListItem, Button, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import classes from "./ForumItem.module.scss";

export default function ForumItem(props) {
  const { user } = useContext(AuthContext);
  var { forum } = props;
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [forumName, setForumName] = useState("");

  const handleDeleteForum = () => {
    axios.delete(`/api/forum/${forum._id}`);
    history.push(`/category/${forum.categoryId}`);
  };

  const handleEditForum = async (id) => {
    setIsEditing(false);
    forum.title = forumName === "" ? forum.title : forumName;
    try {
      await axios.put("/api/forum/" + id + "/edit", { title: forum.title });
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleEditForumInput = (id) => {
    setIsEditing(true);
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
        secondary={new Date(forum.createdAt).toUTCString()}
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
    </ListItem>
  );
}
