import React from "react";
import "./upload.css";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Upload = () => {
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState([]);
  const [image, setImage] = React.useState("");
  const [bookUrl, setBookUrl] = React.useState("");
  const handleUpload = async (e) => {
    const userId = localStorage.getItem("userID");
    if (!userId) {
      toast.error("Please login to upload a book");
      return;
    }
    if (!title || !author || !description || !category || !image || !bookUrl) {
      toast.error("Please fill-up all the fields");
      return;
    }
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
  };
  return (
    <>
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
            placeholder="Category of the book. Seperated by SPACE(' ') Eg: Fiction Non-Fiction, etc."
            onChange={(e) => {
              const cat = e.target.value;
              // split by ,
              const catArr = cat.split(" ");
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
