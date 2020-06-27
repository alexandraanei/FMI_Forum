import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AlertStore from "../../Stores/AlertStore";

const CreateForum = () => {
  const { id } = useParams();
  const history = useHistory();
  const [title, setTitle] = useState("");

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const data = {
      title,
      categoryId: id,
    };

    const response = await axios.post("/api/forum/create", data);
    AlertStore.showSnackbar({
      message: "Forum creat cu succes.",
      type: "success",
    });
    const { _id } = response.data;
    history.push("/forum/" + _id);
  };

  return (
    <div style={{ padding: "2rem" }}>
    <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ marginRight: 5 }}
        onClick={() => history.push("/category/" + id)}
      >
        Inapoi
      </Button>
      <h1 style={{ marginBottom: "2rem" }}>Forum Nou</h1>

      <form onSubmit={handleOnSubmit}>
        <TextField
          label="Title"
          required
          fullWidth
          margin="normal"
          value={title}
          style={{ marginBottom: 40 }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </form>
    </div>
  );
};

export default CreateForum;
