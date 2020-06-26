import React, { useState, useContext } from "react";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";
import TextEditor from "./TextEditor";
import CreateIcon from "@material-ui/icons/Create";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AlertStore from "../../Stores/AlertStore";

export default function CreateThread () {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [deadline, setDeadline] = useState("");
  const [privatePost, setPrivatePost] = useState(false);

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        data.append("files", files[i]);
      }
    }
    data.append("title", title);
    data.append("content", content);
    data.append("userId", user._id);
    data.append("forumId", id);
    data.append("deadline", deadline);
    data.append("private", privatePost);

    console.log(...data);

    try {
      const response = await axios.post("/api/thread/create", data);
      AlertStore.showSnackbar({
        message: "Postarea va fi revizuita si publicata in scurt timp.",
        type: "info",
      });
      history.push("/forum/" + id);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const onChangeContent = (content, files, deadline, privatePost) => {
    setContent(content);
    setFiles(files);
    setDeadline(deadline);
    setPrivatePost(privatePost);
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

      <form onSubmit={handleOnSubmit} encType="multipart/form-data">
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
