import React, { useState } from "react";
import "./upload.css";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState("");
  const [bookUrl, setBookUrl] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpload = async (e) => {
    const userId = localStorage.getItem("userID");
    if (!userId) {
      navigate("/login");
    }
    if (!title || !author || !description || !category || !image || !bookUrl) {
      toast.error("Please fill-up all the fields");
      return;
    }
    setOpen(true);
    await axios
      .post(`/books/upload/${userId}`, {
        title,
        author,
        description,
        category,
        image,
        bookUrl,
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("Book uploaded successfully");
        } else {
          toast.error(`Book upload failed with status code: ${res.status}`);
        }
      })
      .catch((err) => {
        console.log(err);
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
      <h1>Upload Books</h1>
      <Toaster />
      <div className="form">
        <div className="book-name">
          <label htmlFor="name" className="name">
            Book name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Title of the book"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="book-name">
          <label htmlFor="author" className="author">
            Author
          </label>
          <input
            type="text"
            name="author"
            id="author"
            placeholder="Author of the book"
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="book-name">
          <label htmlFor="description" className="description">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            cols="10"
            placeholder="Description of the book"
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="book-name">
          <label htmlFor="category" className="category">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            placeholder="Category of the book. Seperated by COMMA(',') Eg: Fiction,Non-Fiction, etc."
            onChange={(e) => {
              const cat = e.target.value;
              // split by ,
              const catArr = cat.split(",");
              setCategory(catArr);
            }}
            required
          />
        </div>
        <div className="book-name">
          <label htmlFor="image" className="image">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            id="image"
            placeholder="Image URL of the book"
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div className="book-name">
          <label htmlFor="book">Book URL</label>
          <input
            type="text"
            name="book"
            id="book"
            placeholder="Book URL of the book"
            onChange={(e) => setBookUrl(e.target.value)}
            required
          />
        </div>
        <div className="book-submit">
          <button className="submit" onClick={() => handleUpload()}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Upload;
