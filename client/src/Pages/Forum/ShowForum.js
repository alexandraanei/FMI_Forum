import React, { useState, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../Contexts/AuthContext";
import { List, Divider } from "@material-ui/core";
import ThreadItem from "./ThreadItem";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CreateIcon from '@material-ui/icons/Create';

export default function ShowForum() {
  const history = useHistory();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [forum, setForum] = useState(null);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    getForum();
    getThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getForum = async () => {
    const response = await axios.get("/api/forum/" + id);
    setForum(response.data);
  };

  const getThreads = async () => {
    const response = await axios.get("/api/thread/forum/" + id);
    setThreads(response.data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ marginRight: 5 }}
        onClick={() => history.push("/category/" + forum.categoryId)}
      >
        Inapoi
      </Button>
      {user && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<CreateIcon />}
          onClick={() => history.push("/thread/create/" + id)}
        >
          Postare noua
        </Button>
      )}
      {forum && <h1>{forum.title}</h1>}
      {forum?.pinnedPosts.length > 0 && (
        <React.Fragment>
          <h3>Postari fixate</h3>
          <List>
            {threads.map(
              (thread, index) =>
                forum?.pinnedPosts.includes(thread._id) && (
                  <ThreadItem
                    key={index}
                    thread={thread}
                    index={index}
                    pinned
                  />
                )
            )}
          </List>
          <Divider style={{ margin: "2rem 0" }} />
        </React.Fragment>
      )}
      <List>
        {threads.map(
          (thread, index) =>
            !forum?.pinnedPosts.includes(thread._id) && (
              <ThreadItem key={index} thread={thread} index={index} />
            )
        )}
      </List>
    </div>
  );
}
