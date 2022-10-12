import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const EditBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState("");
  const [bookUrl, setBookUrl] = useState("");
  const location = useLocation();
  const bookId = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    setOpen(true);
    const userId = localStorage.getItem("userID");
    if (!userId) {
      navigate("/login");
    }
    if (!title || !author || !description || !category || !image || !bookUrl) {
      toast.error("Please fill-up all the fields");
      return;
    }
    await axios
      .put(`/books/update/${userId}/${bookId}`, {
        title,
        author,
        description,
        category,
        image,
        bookUrl,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Book updated successfully!");
          setTitle(res.data.title);
          setAuthor(res.data.author);
          setDescription(res.data.description);
          setCategory(res.data.category);
          setImage(res.data.image);
          setBookUrl(res.data.bookUrl);
        } else {
          toast.error(`${res.status}: ${res.data.message}`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
    setOpen(false);
  };

  const fetchData = async () => {
    setOpen(true);
    await axios
      .get(`/books/edit/${bookId}`)
      .then((res) => {
        setTitle(res.data.title);
        setAuthor(res.data.author);
        setDescription(res.data.description);
        setCategory(res.data.category);

        setImage(res.data.image);
        setBookUrl(res.data.bookUrl);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message || err.message);
      });
    setOpen(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [location, bookId]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <h1>Update Book</h1>
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
            value={title}
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
            value={author}
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
            value={description}
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
            placeholder="Category of the book. Seperated by COMMA(',') Eg: Fiction Non-Fiction, etc."
            onChange={(e) => {
              const cat = e.target.value;
              // split by comma
              const catArr = cat.replaceAll(" ", "").split(",");
              setCategory(catArr);
            }}
            value={category.toString()}
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
            value={image}
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
            value={bookUrl}
          />
        </div>
        <div className="book-submit">
          <button className="submit" onClick={() => handleUpdate()}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default EditBook;
