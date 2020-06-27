import React, { useState, useEffect, useContext } from "react";
import classNames from 'classnames';
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../Contexts/AuthContext";
import { List, Divider, Button } from "@material-ui/core";
import ThreadItem from "./ThreadItem";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CreateIcon from "@material-ui/icons/Create";
import classes from "./ShowForum.module.scss";

export default function ShowForum() {
  const history = useHistory();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [forum, setForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [mounted, setMounted] = useState(false);

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
    setMounted(true);
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
      <div className={classes.fixed}>
        {forum && <h1>{forum.title}</h1>}
        {forum?.pinnedPosts.length > 0 && (
          <React.Fragment>
          <div className={classes.border} />
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
          </React.Fragment>
        )}
      </div>
      {forum?.pinnedPosts.length > 0 && (
        <Divider style={{ margin: "15px 0" }} />
      )}
      <div className={classNames(classes.fixed, classes.posts)}>
      {(threads?.length === 0 && mounted)&& (<div style={{ marginBottom: -15 }}>Nu exista postari in acest forum.</div>)}
      <List>
        {threads.map(
          (thread, index) =>
            !forum?.pinnedPosts.includes(thread._id) && (
              <ThreadItem key={index} thread={thread} index={index} />
            )
        )}
      </List>
      </div>
    </div>
  );
}
