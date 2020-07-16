import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import { List } from "@material-ui/core";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import ForumItem from "./ForumItem";
import classes from "./BrowseCategories.module.scss";
import AlertStore from "../../Stores/AlertStore";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddAlertIcon from "@material-ui/icons/AddAlert";

export const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#f0f2ff",
  },
}));

export default function CategoryItem(props) {
  const { user } = useContext(AuthContext);
  const { category, index } = props;
  const history = useHistory();
  const root = useStyles();
  const [fora, setFora] = useState([]);
  const [subscribed, setSubscribed] = useState(
    user?.subscribedCategories.includes(category._id)
  );

  useEffect(() => {
    getFora();
  });

  const getFora = async () => {
    const response = await axios.get("/api/forum/category/" + category._id);
    setFora(response.data);
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
      setSubscribed(true);
      AlertStore.showSnackbar({
        message: "Te-ai abonat.",
        type: "success",
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
      setSubscribed(false);
      AlertStore.showSnackbar({
        message: "Te-ai dezabonat.",
        type: "success",
      });
    } catch (err) {
      console.log(err.response);
    }
    history.push("/category");
  };

  return (
    <ExpansionPanel
      defaultExpanded={
        subscribed || user?.subscribedCategories.length === 0 || !user
      }
      key={index}
      classes={root}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-label="Expand"
        aria-controls={`${category.title}-content`}
        id={`${category.title}-header`}
        className={classes.panel}
      >
        <Typography
          aria-label={`${category.title}-typo`}
          onClick={(event) => handleCategoryOnClick(event, category._id)}
          onFocus={(event) => event.stopPropagation()}
          style={{
            fontWeight: "bold",
            color: "#3f51b5",
            textShadow: "0.2px 0.2px",
          }}
        >
          {category.title}
        </Typography>
        <div style={{ flexGrow: 1 }} />
        {user?.type === "user" && (
          <Tooltip
            title={subscribed ? "Dezaboneaza-te" : "Aboneaza-te"}
            aria-label="subscribe"
          >
            <IconButton
              variant="contained"
              color={subscribed ? "primary" : "default"}
              size="small"
              className={classes.button}
              onClick={(e) => {
                e.stopPropagation();
                subscribed
                  ? handleUnsubscribe(category._id)
                  : handleSubscribe(category._id);
              }}
            >
              <AddAlertIcon />
            </IconButton>
          </Tooltip>
        )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <List style={{ width: "100%" }}>
          {fora.map((forum, index) => (
            <ForumItem key={index} index={index} forum={forum} />
          ))}
        </List>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
