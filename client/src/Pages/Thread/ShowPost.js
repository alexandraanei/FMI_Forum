import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
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
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AuthContext from "../../Contexts/AuthContext";
import AlertStore from "../../Stores/AlertStore";

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

export default function ShowPost(props) {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { index, post, setPosts } = props;
  const [postContent, setPostContent] = useState("");
  const [postPhoto, setPostPhoto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [like, setLike] = useState(post?.likedBy.includes(user?._id));
  const [likesLength, setLikesLength] = useState(post?.likedBy.length);

  const handleDeletePost = (id) => {
    setPosts(post);
    axios.delete(`/api/post/${id}`);
    AlertStore.showSnackbar({
      message: "Postarea a fost stearsa cu succes.",
      type: "success",
    });
    history.push(`/thread/${post.threadId}`);
  };

  const handleLikePost = async (id) => {
    try {
      await axios.put(`/api/post/like/${id}`, { user: user._id });
    } catch (err) {
      console.log(err.response);
    }
    history.push(`/thread/${post.threadId}`);
    setLike(true);
    setLikesLength(likesLength + 1);
  };

  const handleUnlikePost = async (id) => {
    try {
      await axios.put(`/api/post/unlike/${id}`, { user: user._id });
    } catch (err) {
      console.log(err.response);
    }
    history.push(`/thread/${post.threadId}`);
    setLike(false);
    setLikesLength(likesLength - 1);
  };

  const handleEditPost = async (id) => {
    setIsEditing(false);
    post.content = postContent === "" ? post.content : postContent;
    try {
      await axios.put("/api/post/" + id + "/edit", { content: post.content });
      AlertStore.showSnackbar({
        message: "Postarea a fost modificata cu succes.",
        type: "success",
      });
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleEditPostInput = (id) => {
    setIsEditing(true);
  };

  return (
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
          subheader={
            <React.Fragment>
              <Typography variant="subtitle2" className={classes.pos} color="textSecondary">
                {post.userId.type === 'admin' && 'Administrator'}
                {post.userId.type === 'mod' && 'Moderator'}
              </Typography>
              <Typography variant="caption">
                {new Date(post.createdAt).toLocaleDateString("ro-RO", {
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </Typography>
            </React.Fragment>
          }
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
            {isEditing ? (
              <TextField
                fullWidth
                id="margin-none"
                defaultValue={post.content}
                onChange={(e) => setPostContent(e.target.value)}
                helperText="Modifica comentariul"
              />
            ) : (
              post.content
            )}
          </Typography>
        </CardContent>
        {user && (
          <CardActions disableSpacing classes={{ root: classes.cardActions }}>
            <Tooltip title={like ? "Sterge aprecierea" : "Apreciaza"}>
              <IconButton
                aria-label="like"
                color={like ? "secondary" : "default"}
                onClick={(e) => {
                  e.stopPropagation();
                  like ? handleUnlikePost(post._id) : handleLikePost(post._id);
                }}
              >
                <FavoriteIcon />
              </IconButton>
            </Tooltip>
            <div>
              {likesLength > 0 &&
                `${
                  likesLength === 1 ? "O persoana " : `${likesLength} persoane `
                }apreciaza acest comentariu`}
            </div>
            <div style={{ flexGrow: 1 }} />
            {(user?.type === "admin" ||
              user?.type === "mod" ||
              user._id === post.userId._id) && (
              <React.Fragment>
                <Tooltip
                  title={isEditing ? "Salveaza" : "Editeaza comentariul"}
                >
                  <IconButton
                    aria-label="edit"
                    onClick={
                      isEditing
                        ? (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEditPost(post._id);
                          }
                        : (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEditPostInput(post._id);
                          }
                    }
                  >
                    {isEditing ? <CheckIcon /> : <CreateIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sterge comentariul">
                  <IconButton
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )}
          </CardActions>
        )}
      </Card>
      <div> &nbsp; </div>
    </div>
  );
}
