import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./axiosInstance";
import { AxiosError } from "axios";
import { Post, Todo, User } from "./types";

const getFeedData = () => {
  const postsPromise = axiosInstance.get("/posts");
  const todosPromise = axiosInstance.get("/todos");
  const usersPromise = axiosInstance.get("/users");

  return Promise.all([postsPromise, todosPromise, usersPromise]);
};

function App() {
  const [accessToken] = useLocalStorage("accessToken", "");
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>();
  const [todos, setTodos] = useState<Todo[]>();
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    if (accessToken) return;
    navigate("/login");
  }, [accessToken, navigate]);

  useEffect(() => {
    getFeedData()
      .then((responses) => {
        const [postsResponse, todosResponse, usersResponse] = responses;
        setPosts(postsResponse.data);
        setTodos(todosResponse.data);
        setUsers(usersResponse.data);
      })
      .catch((error: AxiosError) => {
        if (error.response?.status !== 401) return;
        navigate("/login");
      });
  }, [navigate]);

  if (!posts || !todos || !users) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <section>
        <h1>Posts:- </h1>
        {posts.map(({ id, title, body }) => (
          <div key={id}>
            <h4>Title: {title}</h4>
            <p>{body}</p>
          </div>
        ))}
      </section>
      <section>
        <h1>Todos:- </h1>
        {todos.map(({ id, title, completed }) => (
          <div key={id}>
            <h4>
              <b>Title</b>: {title}
            </h4>
            <p>
              <b>Completed</b>: {completed ? "true" : "false"}
            </p>
          </div>
        ))}
      </section>
      <section>
        <h1>Users:- </h1>
        {users.map(({ id, name, email, phone, website }) => (
          <div key={id}>
            <h4>Name: {name}</h4>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            <p>Website: {website}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
