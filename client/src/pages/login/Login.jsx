import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import "./login.css";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    await axios
      .post("/auth/login", { email, password })
      .then((res) => {
        localStorage.setItem("userID", res.data._id);
        localStorage.setItem("token", res.data.token);
        console.log(res.data._id);
        if (res.status === 200) {
          navigate(`/upload/${res.data._id}`);
        } else {
          toast.error(`Login failed: ${res.code}`);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
    // save userId in localStorage
  };
  return (
    <div className="app">
      <Navbar />
      <div className="main-container">
        <Toaster />
        <h1>Login</h1>
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
      </div>
      <Footer />
    </div>
  );
};

export default Login;
