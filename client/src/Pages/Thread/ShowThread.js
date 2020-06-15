import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, TextField, Button, FormHelperText, Grid,
    Card, CardActions, CardHeader, CardMedia, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import FileUpload from '@material-ui/icons/AddPhotoAlternate';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AuthContext from "../../Contexts/AuthContext";
import { convertFromRaw, EditorState } from 'draft-js';

const useStyles = makeStyles(theme => ({
    grid: {
        marginBottom: 10,
    },
    avatar: {
        marginTop: 10,
        width: theme.spacing(6),
        height: theme.spacing(6),
    },
    input: {
        display: 'none',
    },
    replyRoot: {
        backgroundColor: '#f0f2ff',
    },
    replyPhoto: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    replyContent: {
        borderBottom: '1px solid #9aa2ce',
    },
    cardActions: {
        backgroundColor:'#e2e6ff',
    },
}));

export default function ShowThread() {
    const classes = useStyles();
    const { user } = useContext(AuthContext)
    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyPhoto, setReplyPhoto] = useState("");
    const { id } = useParams();

    useEffect(() => {
        getThread();
        getPosts(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getThread = async () => {
        const response = await axios.get('/api/thread/' + id);
        setThread(response.data);
    };

    const getPosts = async page => {
        const response = await axios.get('/api/post/thread/' + id, {
            params: {
                page
            }
        });
        if (response.data.length) {
            setPosts(response.data);
            setPage(page + 1);
            setHasMore(true);
        } else {
            setHasMore(false);
        }
    };

    const handleReply = async event => {
        event.preventDefault();
        if (!replyContent) return;

        const data = new FormData();
        if(replyPhoto) data.append('photo', replyPhoto);
        data.append('userId', user._id);
        data.append('threadId', thread._id);
        data.append('content', replyContent);

        try {
            const response = await axios.post("/api/post/create", data);
            setPosts([...posts, response.data]);
            setReplyContent('');
        } catch (err) {
            console.log(err.response.data.message);
        }
        
    }

    const onChangeHandler = e => {
        setReplyPhoto(e.target.files[0]);
        console.log(e.target.files[0]);
    }

    return (
        <div style={{ padding: "2rem" }}>
            {thread && <h1>{thread.title}</h1>}
            {thread && <p>{thread.content}</p>}
                {posts.map((post, index) => (
                    <div key={index}>
                    <Card className={classes.replyRoot}>
                    <CardHeader
                        avatar={
                        <Avatar alt={`${index}-avatar`}
                                src={post.userId.avatar}
                                className={classes.avatar} />
                        }
                        title={`${post.userId.firstName} ${post.userId.lastName}`}
                        subheader={new Date(post.createdAt).toUTCString()}
                    />
                    {post.photo && 
                            <CardMedia 
                                title={`${index}-photo`}
                                component="img"
                                src={post.photo}
                                style = {{ height: post.photo.height, maxWidth: 300, maxHeight: 200, paddingLeft: 20, paddingTop: 20 }}
                            />
                    }
                    <CardContent classes={{ root: classes.replyContent }}>
                        <Typography variant="body2" component="div">
                            {post.content}
                        </Typography>
                    </CardContent>
                    <CardActions 
                        disableSpacing
                        classes={{ root: classes.cardActions }}
                    >
                        <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                        </IconButton>
                    </CardActions>
                    </Card>
                    <div> &nbsp; </div>
                    </div>
                ))}
            <Button 
                variant="contained"
                color="primary"
                disabled={page <= 2}
                style={{ marginRight: "1rem" }}
                onClick={() => getPosts(page-2)}
            >
                Previous page
            </Button>
            <Button 
                variant="contained"
                color="primary"
                disabled={!hasMore}
                style={{ marginRight: "1rem" }}
                onClick={() => getPosts(page)}
            >
                Next page
            </Button>

            {user && <Button variant="contained" color="primary" onClick={() => setIsReplying(true)}>Reply</Button>}
            {isReplying && (
                <form onSubmit={handleReply}>
                    <Grid container wrap="nowrap" spacing={2} className={classes.grid}>
                        <Grid item>
                            <Avatar
                                alt="reply_avatar"
                                src={user.avatar}
                                className={classes.avatar}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                label="Reply..."
                                value={replyContent}
                                onChange={e => setReplyContent(e.target.value)}
                            />
                            <FormHelperText id="component-helper-text">Upload photo...</FormHelperText>
                    <input accept="image/*" onChange={onChangeHandler} className={classes.input} id="icon-button-file" type="file" />
                    <label htmlFor="icon-button-file">
                        <Button variant="contained" component="span" className={classes.button}>
                            <FileUpload/>&nbsp;Upload
                        </Button>
                    </label>
                    <span className={classes.filename}>   
                        {replyPhoto ? replyPhoto.name : ''}
                    </span>
                        </Grid>
                    </Grid>
                   <Button variant="contained" type="submit">Reply</Button>
                </form>
            )}
        </div>
    )
}