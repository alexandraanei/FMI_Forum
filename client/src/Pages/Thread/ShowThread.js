import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  TextField,
  Button,
  FormHelperText,
  Grid,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Link,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FileUpload from "@material-ui/icons/AddPhotoAlternate";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import AuthContext from "../../Contexts/AuthContext";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const useStyles = makeStyles((theme) => ({
  grid: {
    marginBottom: 10,
  },
  avatar: {
    marginTop: 10,
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  input: {
    display: "none",
  },
  replyRoot: {
    backgroundColor: "#f0f2ff",
  },
  replyPhoto: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  replyContent: {
    borderBottom: "1px solid #9aa2ce",
  },
  cardActions: {
    backgroundColor: "#e2e6ff",
  },
}));

export default function ShowThread() {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyPhoto, setReplyPhoto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [threadName, setThreadName] = useState("");
  const { id } = useParams();

  useEffect(() => {
    getThread();
    getPosts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getThread = async () => {
    const response = await axios.get("/api/thread/" + id);
    setThread(response.data);
  };

  const getPosts = async (page) => {
    const response = await axios.get("/api/post/thread/" + id, {
      params: {
        page,
      },
    });
    if (response.data.length) {
      setPosts(response.data);
      setPage(page + 1);
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  };

  const handleReply = async (event) => {
    setIsReplying(false);
    event.preventDefault();
    if (!replyContent) return;

    const data = new FormData();
    if (replyPhoto) data.append("photo", replyPhoto);
    data.append("userId", user._id);
    data.append("threadId", thread._id);
    data.append("content", replyContent);

    try {
      const response = await axios.post("/api/post/create", data);
      setPosts([...posts, response.data]);
      setReplyContent("");
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const onChangeHandler = (e) => {
    setReplyPhoto(e.target.files[0]);
  };

  const handleEditThread = async (id) => {
    setIsEditing(false);
    thread.title = threadName === "" ? thread.title : threadName;
    try {
      await axios.put("/api/thread/" + id + "/edit", { title: thread.title });
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleEditThreadInput = (id) => {
    setIsEditing(true);
  };

  const handleDeleteThread = () => {
    axios.delete(`/api/thread/${thread._id}`);
    history.push(`/forum/${thread.forumId}`);
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post._id !== id));
    axios.delete(`/api/post/${id}`);
    history.push(`/thread/${thread._id}`);
  };

  const handleLikePost = async (id) => {
    try {
      await axios.put(`/api/post/like/${id}`, { user: user._id });
    } catch (err) {
      console.log(err.response);
    }

    // console.log('like');
    history.push(`/thread/${thread._id}`);
  };

  const handleUnlikePost = async (id) => {
    try {
      await axios.put(`/api/post/unlike/${id}`, { user: user._id });
    } catch (err) {
      console.log(err.response);
    }
    history.push(`/thread/${thread._id}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ marginRight: 5 }}
        onClick={() => history.push("/forum/" + thread.forumId)}
      >
        Inapoi
      </Button>
      {user?.type === "admin" && (
        <React.Fragment>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            style={{ marginRight: 4 }}
            startIcon={<CreateIcon />}
            onClick={
              isEditing
                ? (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditThread(thread._id);
                  }
                : (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditThreadInput(thread._id);
                  }
            }
          >
            {isEditing ? "Ok" : "Redenumeste titlu"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteThread(thread._id);
            }}
          >
            Sterge
          </Button>
        </React.Fragment>
      )}
      {thread && (
        <React.Fragment>
          <h1>
            {isEditing ? (
              <TextField
                fullWidth
                id="margin-none"
                defaultValue={thread.title}
                onChange={(e) => setThreadName(e.target.value)}
                helperText="Schimba nume"
                inputProps={{ style: { fontSize: 32 } }}
              />
            ) : (
              thread.title
            )}
          </h1>
          <Card className={classes.replyRoot}>
            <CardHeader
              avatar={
                <Link
                  component="button"
                  style={{ fontSize: 18 }}
                  color="inherit"
                  onClick={() => history.push("/profile/" + thread.userId._id)}
                >
                  <Avatar
                    src={thread?.userId.avatar}
                    className={classes.avatar}
                  />
                </Link>
              }
              title={
                <Link
                  component="button"
                  style={{ fontSize: 18 }}
                  color="inherit"
                  onClick={() => history.push("/profile/" + thread?.userId._id)}
                >{`${thread?.userId.firstName} ${thread?.userId.lastName}`}</Link>
              }
              subheader={new Date(thread?.createdAt).toLocaleDateString(
                "ro-RO",
                { dateStyle: "full", timeStyle: "medium" }
              )}
            />
            {/* {thread.photo && (
              <CardMedia
                component="img"
                src={post.photo}
                style={{
                  height: post.photo.height,
                  maxWidth: 300,
                  maxHeight: 200,
                  paddingLeft: 20,
                  paddingTop: 20,
                }}
              />
            )} */}
            <CardContent classes={{ root: classes.replyContent }}>
              <div dangerouslySetInnerHTML={{ __html: thread?.content }} />
            </CardContent>
            {user && (
              <CardActions
                disableSpacing
                classes={{ root: classes.cardActions }}
              >
                <IconButton
                  aria-label="add to favorites"
                  // color={
                  //   thread?.likedBy.includes(user._id) ? "secondary" : "default"
                  // }
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   thread?.likedBy.includes(user._id)
                  //     ? handleUnlikePost(thread._id)
                  //     : handleLikePost(thread._id);
                  // }}
                >
                  <FavoriteIcon />
                </IconButton>
                {/* <p>{thread?.likedBy.length || ""}</p> */}
                {(user?.type === "admin" ||
                  user?.type === "mod" ||
                  user._id === thread?.userId._id) && (
                  <React.Fragment>
                    <IconButton aria-label="edit">
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   handleDeletePost(thread._id);
                      // }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </React.Fragment>
                )}
              </CardActions>
            )}
          </Card>
        </React.Fragment>
      )}
      <Divider style={{ margin: "2rem 0" }}/>
      {posts?.length > 0 && <h3>{posts.length} {posts?.length === 1 ? 'raspuns' : 'raspunsuri'}</h3>}
      {posts.map((post, index) => (
        <div key={index}>
          <Card className={classes.replyRoot}>
            <CardHeader
              avatar={
                <Link
                  component="button"
                  style={{ fontSize: 18 }}
                  color="inherit"
                  onClick={() => history.push("/profile/" + post.userId._id)}
                >
                  <Avatar
                    alt={`${index}-avatar`}
                    src={post.userId.avatar}
                    className={classes.avatar}
                  />
                </Link>
              }
              title={
                <Link
                  component="button"
                  style={{ fontSize: 18 }}
                  color="inherit"
                  onClick={() => history.push("/profile/" + post.userId._id)}
                >{`${post.userId.firstName} ${post.userId.lastName}`}</Link>
              }
              subheader={new Date(post.createdAt).toLocaleDateString("ro-RO", {
                dateStyle: "full",
                timeStyle: "medium",
              })}
            />
            {post.photo && (
              <CardMedia
                component="img"
                src={post.photo}
                style={{
                  height: post.photo.height,
                  maxWidth: 300,
                  maxHeight: 200,
                  paddingLeft: 20,
                  paddingTop: 20,
                }}
              />
            )}
            <CardContent classes={{ root: classes.replyContent }}>
              <Typography variant="body2" component="div">
                {post.content}
              </Typography>
            </CardContent>
            {user && (
              <CardActions
                disableSpacing
                classes={{ root: classes.cardActions }}
              >
                <IconButton
                  aria-label="add to favorites"
                  color={
                    post?.likedBy.includes(user._id) ? "secondary" : "default"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    post?.likedBy.includes(user._id)
                      ? handleUnlikePost(post._id)
                      : handleLikePost(post._id);
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
                <p>{post?.likedBy.length || ""}</p>
                {(user?.type === "admin" ||
                  user?.type === "mod" ||
                  user._id === post.userId._id) && (
                  <React.Fragment>
                    <IconButton aria-label="edit">
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </React.Fragment>
                )}
              </CardActions>
            )}
          </Card>
          <div> &nbsp; </div>
        </div>
      ))}
      <Button
        variant="contained"
        color="primary"
        disabled={page <= 2}
        style={{ marginRight: 5 }}
        startIcon={<ArrowBackIcon />}
        onClick={() => getPosts(page - 2)}
      >
        Pagina anterioara
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={!hasMore}
        style={{ marginRight: 5 }}
        endIcon={<ArrowForwardIcon />}
        onClick={() => getPosts(page)}
      >
        Pagina urmatoare
      </Button>

      {user && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsReplying(true)}
        >
          Raspunde
        </Button>
      )}
      {isReplying && (
        <form onSubmit={handleReply}>
          <Grid container wrap="nowrap" spacing={2} className={classes.grid}>
            <Grid item>
              <Avatar
                alt="reply_avatar"
                src={user?.avatar}
                className={classes.avatar}
              />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                label="Raspunde..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <FormHelperText id="component-helper-text">
                Incarca fotografie...
              </FormHelperText>
              <input
                accept="image/*"
                onChange={onChangeHandler}
                className={classes.input}
                id="icon-button-file"
                type="file"
              />
              <label htmlFor="icon-button-file">
                <Button
                  variant="contained"
                  component="span"
                  className={classes.button}
                >
                  <FileUpload />
                  &nbsp;Incarca
                </Button>
              </label>
              <span className={classes.filename}>
                {replyPhoto ? replyPhoto.name : ""}
              </span>
            </Grid>
          </Grid>
          <Button variant="contained" type="submit">
            Raspunde
          </Button>
        </form>
      )}
    </div>
  );
}
