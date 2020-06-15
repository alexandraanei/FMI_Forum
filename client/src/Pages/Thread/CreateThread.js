import React, { useState, useContext } from "react";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";
import TextEditor from './TextEditor';

const CreateForum = () => {
    const {user} = useContext(AuthContext);
    const {id} = useParams();
    const history = useHistory();
    const [title, setTitle] = useState("");
    // const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [content, setContent] = useState("");

    const handleOnSubmit = async event => {
        event.preventDefault();

        const data = {
            title,
            content: JSON.stringify({ content }),
            userId: user._id,
            forumId: id
        };

        console.log(data);

        const response = await axios.post('/api/thread/create', data);
        const {_id} = response.data;
        history.push('/thread/'+_id);
    };

    const onChangeContent = content => {
        setContent(content);
        console.log(content);
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1 style={{ marginBottom: "2rem" }}>Create Thread</h1>

            <form onSubmit={handleOnSubmit}>
                <TextField label="Title"
                           required
                           fullWidth
                           margin="normal"
                           value={title}
                           onChange={e => setTitle(e.target.value)}/>
                <TextEditor onChangeContent={onChangeContent} />
                <Button type="submit" variant="contained" color="primary">Create</Button>
            </form>
        </div>
    )
};

export default CreateForum;