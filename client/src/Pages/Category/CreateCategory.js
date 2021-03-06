import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AlertStore from '../../Stores/AlertStore';

const CreateCategory = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const data = {
      title,
    };

    const response = await axios.post("/api/category/create", data);
    const { _id } = response.data;
    AlertStore.showSnackbar({
      message: "Subforumul a fost creat cu succes.",
      type: "success",
    });
    history.push("/category/" + _id);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ marginRight: 5 }}
        onClick={() => history.push("/category")}
      >
        Inapoi
      </Button>
      <h1 style={{ marginBottom: "2rem" }}>Forum nou</h1>

      <form onSubmit={handleOnSubmit}>
        <TextField
          label="Titlu"
          required
          fullWidth
          margin="normal"
          value={title}
          style={{ marginBottom: 40 }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button
          startIcon={<CreateIcon />}
          type="submit"
          variant="contained"
          color="primary"
        >
          Creeaza
        </Button>
      </form>
    </div>
  );
};

export default CreateCategory;
