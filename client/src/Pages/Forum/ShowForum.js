import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { List, ListItemText, ListItem } from "@material-ui/core";

export default function ShowForum() {
    const history = useHistory();
    const { id } = useParams();

    const [forum, setForum] = useState(null);
    const [threads, setThreads] = useState([]);
 
    useEffect(() => {
        getForum();
        getThreads();
    });

    const getForum = async () => {
        const response = await axios.get('/api/forum/'+id);
        setForum(response.data);
    };

    const getThreads = async () => {
        const response = await axios.get('/api/thread/forum/'+id);
        setThreads(response.data);
    };

    return (
        <div style={{padding: "2rem"}}>

            {forum && <h1>{forum.title}</h1>}

            <Button variant="contained" color="primary" onClick={() => history.push("/thread/create/"+id)}>Create Thread</Button>
            <List>
                {threads.map((thread, index) => (
                    <ListItem key={index} button onClick={() => history.push(`/thread/${thread._id}`)}>
                        <ListItemText primary={thread.title} secondary={new Date(thread.createdAt).toUTCString()} />
                    </ListItem>
                ))}
            </List>
        </div>
    )
}