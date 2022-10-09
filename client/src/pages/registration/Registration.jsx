import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Registration = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await axios
      .post("/auth/register", { name, email, password })
      .then((res) => {
        console.log(res);
        toast.success("Registration successful");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Registration failed: ${err.code}`);
      });
  };

  return (
    <>
      <h1>Registration</h1>
      <Toaster />
      <div className="form">
        <div className="book-name">
          <label htmlFor="name" className="name">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Full Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          <label htmlFor="confirm" className="confirm">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm"
            id="confirm"
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="book-name">
          <Link to={"/login"} className="registerLink">
            Already have an account? <span>Login</span>
          </Link>
        </div>
        <div className="book-submit">
          <button className="submit" onClick={() => handleRegister()}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Registration;
