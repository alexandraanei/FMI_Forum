import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { List, Divider } from "@material-ui/core";
import ThreadItem from './ThreadItem';

export default function ShowForum() {
    const history = useHistory();
    const { id } = useParams();

    const [forum, setForum] = useState(null);
    const [threads, setThreads] = useState([]);
 
    useEffect(() => {
        getForum();
        getThreads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getForum = async () => {
        const response = await axios.get('/api/forum/' + id);
        setForum(response.data);
    };

    const getThreads = async () => {
        const response = await axios.get('/api/thread/forum/' + id);
        setThreads(response.data);
    };

    return (
        <div style={{padding: "2rem"}}>
            {forum && <h1>{forum.title}</h1>}
            <Button variant="contained" color="primary" onClick={() => history.push("/thread/create/" + id)}>Create Thread</Button>
            <h2>Pinned posts</h2>
            <List>
                {threads.map((thread, index) => (
                    forum?.pinnedPosts.includes(thread._id) && <ThreadItem key={index} thread={thread} index={index} pinned />
                ))}
            </List>
            <Divider style={{ margin: "2rem 0" }}/>
            <List>
                {threads.map((thread, index) => (
                    !forum?.pinnedPosts.includes(thread._id) && <ThreadItem key={index} thread={thread} index={index} />
                ))}
            </List>
        </div>
    )
}