import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import RenderCategory from "./RenderCategory";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import AuthContext from "../../Contexts/AuthContext";
import classes from "./BrowseCategories.module.scss";

export const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#f0f2ff",
  },
}));


export default function BrowseCategories() {
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const root = useStyles();

  // useEffect(() => {
  //     let unmounted = false;
  //     let source = axios.CancelToken.source();

  //     const getCategories = (unmounted, source) => {
  //         axios.get('/api/category',  {
  //             cancelToken: source.token,
  //         })
  //             .then(response => {
  //                 if (!unmounted) {
  //                     // @ts-ignore
  //                     setCategories(response.data);
  //                 }
  //             }).catch(function (e) {
  //             if (!unmounted) {
  //                 if (axios.isCancel(e)) {
  //                     console.log(`request cancelled:${e.message}`);
  //                 } else {
  //                     console.log("another error happened:" + e.message);
  //                 }
  //             }
  //         });
  //     };

  //     getCategories(unmounted, source);

  //     return function () {
  //         unmounted = true;
  //         source.cancel("Cancelling in cleanup");
  //     };
  // }, []);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    await axios.get("/api/category").then((response) => {
      setCategories(response.data);
    });
  };

  const handleCategoryOnClick = (event, id) => {
    event.stopPropagation();
    history.push(`/category/${id}`);
  };

  const handleSubscribe = async (id) => {
    try {
      await axios.put(`/api/user/subscribecategory/${user._id}`, {
        category: id,
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push("/category");
  };

  const handleUnsubscribe = async (id) => {
    try {
      await axios.put(`/api/user/unsubscribecategory/${user._id}`, {
        category: id,
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push("/category");
  };

  return (
    <div style={{ padding: "2rem" }}>
      {user?.type === "admin" && (
        <React.Fragment>
          <h3>Admin options</h3>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/category/create")}
          >
            Creeaza subforum
          </Button>
          <Divider style={{ margin: "2rem 0" }} />
        </React.Fragment>
      )}
      {categories.map((cat, index) => (
        <ExpansionPanel
          defaultExpanded={user?.subscribedCategories.includes(cat._id) || user?.subscribedCategories.length === 0 || !user}
          key={index}
          classes={root}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls={`${cat.title}-content`}
            id={`${cat.title}-header`}
            className={classes.panel}
          >
            <Typography
              aria-label={`${cat.title}-typo`}
              onClick={(event) => handleCategoryOnClick(event, cat._id)}
              onFocus={(event) => event.stopPropagation()}
              style={{ fontWeight: "bold" }}
            >
              {cat.title}
            </Typography>
            <div style={{ flexGrow: 1 }} />
            {user && (<Tooltip
              title={
                user?.subscribedCategories.includes(cat._id)
                  ? "Dezaboneaza-te"
                  : "Aboneaza-te"
              }
              aria-label="subscribe"
            >
              <IconButton
                variant="contained"
                color={
                  user?.subscribedCategories.includes(cat._id)
                    ? "primary"
                    : "default"
                }
                size="small"
                className={classes.button}
                onClick={(e) => {
                  e.stopPropagation();
                  user?.subscribedCategories.includes(cat._id)
                    ? handleUnsubscribe(cat._id)
                    : handleSubscribe(cat._id);
                }}
              >
                <AddAlertIcon />
              </IconButton>
            </Tooltip>)}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <RenderCategory id={cat._id} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
}
