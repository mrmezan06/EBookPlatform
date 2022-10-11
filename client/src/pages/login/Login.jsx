import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = async () => {
    setOpen(true);
    await axios
      .post("/auth/login", { email, password })
      .then((res) => {
        localStorage.setItem("userID", res.data._id);
        localStorage.setItem("token", res.data.token);
        // console.log(res.data._id);
        if (res.status === 200) {
          navigate(`/dashboard/${res.data._id}`);
        } else {
          toast.error(`Login failed: ${res.code}`);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
    setOpen(false);
  };
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <h1>Login</h1>
      <Toaster />
      <div className="form">
        <div className="book-name">
          <label htmlFor="email" className="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="book-name">
          <label htmlFor="password" className="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="book-name">
          <Link to={"/register"} className="registerLink">
            Don't have an account? <span>Register</span>
          </Link>
        </div>

        <div className="book-submit">
          <button className="submit" onClick={() => handleLogin()}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
