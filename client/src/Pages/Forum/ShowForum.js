import React, { useState, useEffect, useContext } from "react";
import classNames from "classnames";
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
  const [fixedThreads, setFixedThreads] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getThreads = async () => {
    const forum = await axios.get("/api/forum/" + id);
    const threads = await axios.get("/api/thread/forum/" + id);
    const basicThreads = threads.data.filter(
      ({ _id: threadId }) =>
        !forum.data.pinnedPosts.some(
          ({ _id: pinnedThreadId }) => pinnedThreadId === threadId
        )
    );
    setForum(forum.data);
    setFixedThreads(forum.data.pinnedPosts);
    setThreads(basicThreads);
    setMounted(true);
  };

  const handleRemoveFixedThread = (fixedThread) => {
    setFixedThreads(
      fixedThreads.filter((thread) => thread._id !== fixedThread._id)
    );
    const newThreads = threads;
    newThreads.push(fixedThread);
    newThreads.sort((thread1, thread2) => new Date(thread1.createdAt) - new Date(thread2.createdAt))
    setThreads(newThreads);
  };

  const handleAddFixedThread = (thread) => {
    console.log('ruleaza');
    setThreads(
      threads.filter(toBeFixed => toBeFixed._id !== thread._id)
    );
    const newFixedThreads = fixedThreads;
    newFixedThreads.push(thread);
    //newThreads.sort((thread1, thread2) => new Date(thread1.createdAt) - new Date(thread2.createdAt))
    setFixedThreads(newFixedThreads);
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
        {fixedThreads?.length > 0 && (
          <React.Fragment>
            <div className={classes.border} />
            <h3>Postari fixate</h3>
            <List>
              {fixedThreads.map((thread, index) => (
                <ThreadItem
                  key={index}
                  thread={thread}
                  index={index}
                  pinned
                  removeFixedThread={handleRemoveFixedThread}
                />
              ))}
            </List>
          </React.Fragment>
        )}
      </div>
      {fixedThreads?.length.length > 0 && (
        <Divider style={{ margin: "15px 0" }} />
      )}
      <div className={classNames(classes.fixed, classes.posts)}>
        {threads?.length === 0 && mounted && (
          <div style={{ marginBottom: -15 }}>
            Nu exista postari in acest forum.
          </div>
        )}
        {console.log(threads)}
        {console.log(fixedThreads)}
        <List>
          {threads?.map((thread, index) => (
            <ThreadItem key={index} thread={thread} index={index} addFixedThread={handleAddFixedThread}/>
          ))}
        </List>
      </div>
    </div>
  );
}
