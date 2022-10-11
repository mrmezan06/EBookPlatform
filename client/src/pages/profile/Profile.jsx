import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./profile.css";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImg, setprofileImg] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userID");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    const userId = localStorage.getItem("userID");
    setOpen(true);
    try {
      if (password === "") {
        await axios
          .put(`/auth/user/${userId}`, { email, name, profileImg })
          .then((res) => {
            setEmail(res.data.email);
            setName(res.data.name);
            setPassword(res.data.password);
            setprofileImg(res.data.profileImg);
            toast.success("Profile has been updated!");
          })
          .catch((error) => {
            toast.error(error.message);
          });
      } else {
        await axios
          .put(`/auth/user/${userId}`, { email, name, profileImg, password })
          .then((res) => {
            setEmail(res.data.email);
            setName(res.data.name);
            setPassword(res.data.password);
            setprofileImg(res.data.profileImg);
            toast.success("Profile has been updated!");
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    } catch (error) {
      toast.error(`Error updating with error code ${error.code}`);
    }
    setOpen(false);
  };

  const fetchData = async (id) => {
    if (!id) {
      navigate("/login");
    }
    setOpen(true);
    await axios
      .get(`/auth/user/${id}`)
      .then((res) => {
        setEmail(res.data.email);
        setName(res.data.name);
        setPassword(res.data.password);
        setprofileImg(res.data.profileImg);
      })
      .catch((err) => {
        toast.error(err.message);
      });
    setOpen(false);
  };

  useEffect(() => {
    fetchData(userId);
    // eslint-disable-next-line
  }, [userId]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <h1>Update Profile</h1>
      <Toaster />
      <div className="profileImgContainer">
        <img
          src={
            profileImg === ""
              ? "https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
              : profileImg
          }
          alt="profile"
          className="profileImg"
        />
      </div>
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
            value={name}
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
            value={email}
          />
        </div>

        <div className="book-name">
          <label htmlFor="password" className="password">
            Change Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your new password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="book-name">
          <label htmlFor="profileImg" className="profileImgUrl">
            Profile Image
          </label>
          <input
            type="text"
            name="profileImg"
            id="profileImg"
            placeholder="Profile Image Url"
            onChange={(e) => setprofileImg(e.target.value)}
            value={profileImg}
          />
        </div>
        <div className="book-submit">
          <button className="submit" onClick={() => handleUpdate()}>
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
