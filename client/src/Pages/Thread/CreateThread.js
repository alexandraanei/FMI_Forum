import React, { useState, useContext } from "react";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";
import TextEditor from "./TextEditor";
import CreateIcon from "@material-ui/icons/Create";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AlertStore from '../../Stores/AlertStore';

const CreateForum = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const data = {
      title,
      content,
      userId: user._id,
      forumId: id,
    };

    const response = await axios.post("/api/thread/create", data);
    AlertStore.showSnackbar({
      message: 'Postarea va fi revizuita si publicata in scurt timp.',
      type: 'info'
    });
    history.push("/forum/" + id);
  };

  const onChangeContent = (content) => {
    setContent(content);
  };

  return (
    <div style={{ padding: "2rem" }}>
    <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ marginRight: 5 }}
        onClick={() => history.push("/forum/" + id)}
      >
        Inapoi
      </Button>
      <h1 style={{ marginBottom: "2rem" }}>Postare noua</h1>

      <form onSubmit={handleOnSubmit}>
        <TextField
          label="Titlu"
          required
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{ maxLength: 50 }}
        />
        <TextEditor onChangeContent={onChangeContent} />
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

export default CreateForum;
