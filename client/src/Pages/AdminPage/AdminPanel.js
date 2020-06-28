import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { List, Divider, Button } from "@material-ui/core";
import UserItem from "./UserItem";
import CategoryItem from "./CategoryItem";
import ThreadItem from "./ThreadItem";
import AddIcon from "@material-ui/icons/Add";

export default function AdminPanel() {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toBeApprovedThreads, setToBeApprovedThreads] = useState([]);

  useEffect(() => {
    getUsers();
    getCategories();
    getToBeApprovedThreads();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/profile/");
      setUsers(response.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get("/api/category");
      setCategories(response.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const getToBeApprovedThreads = async () => {
    try {
      const response = await axios.get("/api/thread/unapproved");
      console.log(response);
      setToBeApprovedThreads(response.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleSetCategories = (CategoryId) => {
    setCategories(categories.filter((category) => category._id !== CategoryId));
  };

  const handleSetThreads = (ThreadId) => {
    setToBeApprovedThreads(
      toBeApprovedThreads.filter((thread) => thread._id !== ThreadId)
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Panou Admin</h1>
      <Divider style={{ margin: "2rem 0" }} />
      {users?.length > 0 && (
        <React.Fragment>
          <h3>Lista de useri</h3>
          <List>
            {users.map((user, index) => (
              <UserItem key={index} user={user} index={index} />
            ))}
          </List>
        </React.Fragment>
      )}
      {toBeApprovedThreads.length > 0 && (
        <React.Fragment>
        <Divider style={{ margin: "2rem 0" }} />
          <h3>Postari in asteptare</h3>
          <List>
            {toBeApprovedThreads.map((thread, index) => (
              <ThreadItem
                key={index}
                index={index}
                thread={thread}
                setThreads={handleSetThreads}
              />
            ))}
          </List>
        </React.Fragment>
      )}
      <Divider style={{ margin: "2rem 0" }} />
      <h3>Lista de subforumuri</h3>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => history.push("/category/create")}
      >
        Creeaza subforum
      </Button>
      <List>
        {categories.map((category, index) => (
          <CategoryItem
            key={index}
            category={category}
            index={index}
            setCategories={handleSetCategories}
          />
        ))}
      </List>
      <Divider style={{ margin: "2rem 0" }} />
    </div>
  );
}
