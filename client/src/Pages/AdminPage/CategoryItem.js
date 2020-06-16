import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  ListItemText,
  ListItem,
  Button,
  TextField,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import classes from "./AdminPanel.module.scss";

export default function CategoryItem(props) {
  const { index } = props;
  var { category } = props;
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleDeleteCategory = (id) => {
    axios.delete(`/api/category/${id}`);
    history.push("/admin");
  };

  const handleEditCategory = async (id) => {
    setIsEditing(false);
    category.title = categoryName;
    try {
        await axios.put("/api/category/" + id + "/edit", { name: categoryName });
    } catch (err) {
        console.log(err.response.data.message);
    }
  };

  const handleEditCategoryInput = (id) => {
    setIsEditing(true);
  };

  return (
    <ListItem
      key={index}
      className={classes.category}
      button={!isEditing}
      onClick={
        !isEditing ? () => history.push(`/category/${category._id}`) : () => {}
      }
    >
      <ListItemText
        primary={
          isEditing ? (
            <TextField
              id="margin-none"
              defaultValue={category.title}
              // className={classes.textField}
              onChange={(e) => setCategoryName(e.target.value)}
              helperText="Schimba nume"
            />
          ) : (
            category.title
          )
        }
      />
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
                    handleEditCategory(category._id);
                  }
                : (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditCategoryInput(category._id);
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
          handleDeleteCategory(category._id);
        }}
      >
        Sterge
      </Button>
    </ListItem>
  );
}
