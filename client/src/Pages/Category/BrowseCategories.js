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
  IconButton, Tooltip
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AuthContext from "../../Contexts/AuthContext";

export const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#f0f2ff",
  },
}));

export default function BrowseCategories() {
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);

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

  const history = useHistory();
  const classes = useStyles();

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
        <ExpansionPanel defaultExpanded key={index} classes={classes}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls={`${cat.title}-content`}
            id={`${cat.title}-header`}
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
            <Tooltip title="Aboneaza-te" aria-label="subscribe">
              <IconButton
                variant="contained"
                color="default"
                size="small"
                // className={classes.button}
                //   startIcon={<DeleteIcon />}
                //   onClick={(e) => {
                //     e.stopPropagation();
                //     handleDeleteThread(thread._id);
                //   }}
              >
                <AddAlertIcon />
              </IconButton>
            </Tooltip>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <RenderCategory id={cat._id} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
}
