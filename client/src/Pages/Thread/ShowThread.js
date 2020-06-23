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
  CardContent,
  Typography,
  Link,
  Divider,
  Tooltip,
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
import CheckIcon from "@material-ui/icons/Check";
import ShowPost from "./ShowPost";
import { Carousel } from "antd";

const useStyles = makeStyles((theme) => ({
  grid: {
    marginBottom: 10,
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  // const [isEditingPost, setIsEditingPost] = useState(false);
  const [threadName, setThreadName] = useState("");
  const [like, setLike] = useState(false);
  const [likesLength, setLikesLength] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    getThread();
    getPosts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getThread = async () => {
    const response = await axios.get("/api/thread/" + id);
    console.log(response.data);
    setThread(response.data);
    setLike(user !== null ? response.data.likedBy.includes(user?._id) : false);
    setLikesLength(response.data.likedBy.length);
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
    setIsEditingTitle(false);
    thread.title = threadName === "" ? thread.title : threadName;
    try {
      await axios.put("/api/thread/" + id + "/edit", { title: thread.title });
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleEditThreadInput = (id) => {
    setIsEditingTitle(true);
  };

  const handleDeleteThread = () => {
    axios.delete(`/api/thread/${thread._id}`);
    history.push(`/forum/${thread.forumId}`);
  };

  const handleLikeThread = async (id) => {
    try {
      await axios.put(`/api/thread/like/${id}`, { user: user._id });
    } catch (err) {
      console.log(err.response);
    }
    history.push(`/thread/${thread._id}`);
    setLike(true);
    setLikesLength(likesLength + 1);
  };

  const handleUnlikeThread = async (id) => {
    try {
      await axios.put(`/api/thread/unlike/${id}`, { user: user._id });
    } catch (err) {
      console.log(err.response);
    }
    history.push(`/thread/${thread._id}`);
    setLike(false);
    setLikesLength(likesLength - 1);
  };

  const handleSetPosts = (PostId) => {
    setPosts(posts.filter((post) => post._id !== PostId._id));
  };

  const handleApproveThread = async (id) => {
    try {
      await axios.put("/api/thread/approve/" + id);
      history.push(`/thread/${thread._id}`);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {thread && (
        <React.Fragment>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            style={{ marginRight: 5 }}
            onClick={() => history.push("/forum/" + thread.forumId)}
          >
            Inapoi
          </Button>
          {(user?.type === "admin" || user?._id === thread.userId._id) && (
            <React.Fragment>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                style={{ marginRight: 4 }}
                startIcon={<CreateIcon />}
                onClick={
                  isEditingTitle
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
                {isEditingTitle ? "Ok" : "Redenumeste titlu"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                style={{ marginRight: 5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteThread(thread._id);
                }}
              >
                Sterge postarea
              </Button>
              {!thread.approved && (
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<CheckIcon />}
                  style={{ background: "#76e676" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveThread(thread._id);
                  }}
                >
                  Aproba postarea
                </Button>
              )}
            </React.Fragment>
          )}
          {thread && (
            <React.Fragment>
              <h1>
                {isEditingTitle ? (
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
                      onClick={() =>
                        history.push("/profile/" + thread.userId._id)
                      }
                    >
                      <Avatar
                        src={thread.userId.avatar}
                        className={classes.avatar}
                      />
                    </Link>
                  }
                  title={
                    <Link
                      component="button"
                      style={{ fontSize: 18 }}
                      color="inherit"
                      onClick={() =>
                        history.push("/profile/" + thread.userId._id)
                      }
                    >{`${thread.userId.firstName} ${thread.userId.lastName}`}</Link>
                  }
                  subheader={
                    <React.Fragment>
                      <Typography variant="subtitle2" color="textSecondary">
                        {thread.userId.type === "admin" && "Administrator"}
                        {thread.userId.type === "mod" && "Moderator"}
                      </Typography>
                      <Typography variant="caption">
                        {new Date(thread.createdAt).toLocaleDateString(
                          "ro-RO",
                          {
                            dateStyle: "full",
                            timeStyle: "medium",
                          }
                        )}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <CardContent >
                  <div dangerouslySetInnerHTML={{ __html: thread.content }} />
                </CardContent>
                {thread.photos.length > 0 && (
                  <Carousel effect="fade" dotPosition="top">
                    {thread.photos.map((photo, index) => (
                      <img
                        alt="alt"
                        src={photo}
                        key={index}
                        width={photo.width}
                        height={photo.height}
                      />
                    ))}
                  </Carousel>
                )}

                <CardContent classes={{ root: classes.replyContent }}>
                  {thread.files.length > 0 && (
                    <div>
                      Fisiere atasate:
                      {thread.files.map((file, index) => (
                        <div key={index}>
                          <Link href={file}>{file}</Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                {user && (
                  <CardActions
                    disableSpacing
                    classes={{ root: classes.cardActions }}
                  >
                    <Tooltip
                      title={like ? "Sterge aprecierea" : "Apreciaza"}
                      aria-label="subscribe"
                    >
                      <IconButton
                        aria-label="add to favorites"
                        color={like ? "secondary" : "default"}
                        onClick={(e) => {
                          e.stopPropagation();
                          like
                            ? handleUnlikeThread(thread._id)
                            : handleLikeThread(thread._id);
                        }}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Tooltip>
                    <p>
                      {likesLength > 0 &&
                        `${
                          likesLength === 1
                            ? "O persoana "
                            : `${likesLength} persoane `
                        }apreciaza aceasta postare`}
                    </p>
                    <div style={{ flexGrow: 1 }} />
                    {(user?.type === "admin" ||
                      user._id === thread.userId._id) && (
                      <React.Fragment>
                        <IconButton aria-label="edit">
                          <CreateIcon />
                        </IconButton>
                      </React.Fragment>
                    )}
                  </CardActions>
                )}
              </Card>
            </React.Fragment>
          )}
          <Divider style={{ margin: "2rem 0" }} />
          {posts?.length > 0 && (
            <h3>
              {posts.length} {posts?.length === 1 ? "raspuns" : "raspunsuri"}
            </h3>
          )}
          {posts.map((post, index) => (
            <ShowPost
              key={index}
              index={index}
              post={post}
              setPosts={handleSetPosts}
            />
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
              <Grid
                container
                wrap="nowrap"
                spacing={2}
                className={classes.grid}
              >
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
        </React.Fragment>
      )}
    </div>
  );
}
