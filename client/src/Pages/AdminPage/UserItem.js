import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  ListItemText,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  TextField,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import classes from "./AdminPanel.module.scss";

export default function AdminPanel(props) {
  const { index } = props;
  var { user } = props;
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleDeleteUser = (id) => {
    axios.delete(`/api/profile/${id}`);
    history.push("/admin");
  };

  const handleEditRole = async (id) => {
    setIsEditing(false);
    setUserRole(userRole.charAt(0).toLowerCase() + user.type.slice(1));
    if (userRole === "mod" || "admin" || "user") {
      user.type = userRole;
      const data = { type: userRole };
      try {
        await axios.put("/api/user/" + id + "/edit", data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
  };

  const handleEditRoleInput = (id) => {
    setIsEditing(true);
    console.log(isEditing);
  };

  return (
    <ListItem
      key={index}
      className={classes.user}
      button={!isEditing}
      onClick={
        !isEditing ? () => history.push(`/profile/${user._id}`) : () => {}
      }
    >
      <ListItemAvatar>
        <Avatar alt={`${user.firstName} ${user.lastName}`} src={user.avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={`${user.firstName} ${user.lastName}`}
        secondary={
          isEditing ? (
            <TextField
              id="margin-none"
              defaultValue={`${
                user.type.charAt(0).toUpperCase() + user.type.slice(1)
              }`}
              // className={classes.textField}
              onChange={(e) => setUserRole(e.target.value)}
              helperText="Schimba rol"
            />
          ) : (
            `Rol: ${user.type.charAt(0).toUpperCase() + user.type.slice(1)}`
          )
        }
      />
      {user.type !== "admin" && (
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
                    handleEditRole(user._id);
                  }
                : (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditRoleInput(user._id);
                  }
            }
          >
            {isEditing ? "Ok" : "Schimba rol"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(user._id);
            }}
          >
            Sterge
          </Button>
        </React.Fragment>
      )}
    </ListItem>
  );
}
