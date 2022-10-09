import React from "react";
import { useEffect } from "react";
import "./home.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Pagination, Box } from "@mui/material";

import { formatDistanceToNow, parseISO } from "date-fns";

const Home = () => {
  const [books, setBooks] = useState([]);
  const location = useLocation();

  const [pageSize, setPageSize] = useState(1);

  const [pages, setPages] = useState(1);

  const itemsPerPage = 3;

  const handlePageChange = (event, page) => {
    setPages(page);
  };

  const fetchBooks = async (category) => {
    if (!category) {
      category = "?";
    } else {
      category = `${category}&`;
    }

    try {
      await axios
        .get(`/books/getBooks${category}page=${pages}&items=${itemsPerPage}`)
        .then((res) => {
          setBooks(res.data.books);
          setPageSize(res.data.pageCount);
          // console.log(books);
          // Fetch User Details
        })
        .catch((err) => {
          console.log(err);
          toast.error(
            "Books fetching failed with status code: " + err.response.status
          );
        });
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const category = location.search;
    fetchBooks(category);
    // eslint-disable-next-line
  }, [location, pages]);

  return (
    <div className="book-container">
      <Toaster />
      {/* if books.length===0 then shows No books found */}
      {books.length === 0 && (
        <div className="no-books">
          <h1>No Books Found!</h1>
        </div>
      )}
      {books?.map((book) => (
        <div className="book" key={book._id}>
          <div className="cover">
            <img src={book.image} alt="" className="bookCover" />
          </div>
          <div className="bookInfo">
            <div className="bookTitle">{book.title}</div>
            <div className="bookDesc">{book.description}</div>
            <div className="bookAuthor">
              Author: <span>{book.author}</span>
            </div>
            <div className="bookUploader">
              Uploader: <span>{book.user.name}</span>
            </div>
            <div className="agotime">
              Uploaded :{" "}
              <span>{formatDistanceToNow(parseISO(book.createdAt))} ago</span>
            </div>
            <div className="bookButtons">
              <a className="bookLink" href={book.bookUrl}>
                Read
              </a>
              <a
                className="bookLink"
                href={book.bookUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      ))}
      {/* Centering the paginate components */}
      <Box
        justifyContent="center"
        display="flex"
        alignItems="center"
        sx={{ margin: "20px 0px" }}
      >
        {/* Paginate */}
        <Pagination
          count={pageSize}
          color={"secondary"}
          onChange={handlePageChange}
        />
      </Box>
    </div>
  );
};

export default Home;
