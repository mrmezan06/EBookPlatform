import React from "react";
import { useEffect } from "react";
import "./home.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination, Box } from "@mui/material";

import { formatDistanceToNow, parseISO } from "date-fns";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import numberWithCommas from "../../utils/commaSeperated";

const Home = () => {
  const [books, setBooks] = useState([]);
  const location = useLocation();

  const [pageSize, setPageSize] = useState(1);
  const [count, setCount] = useState(0);

  const [pages, setPages] = useState(1);

  const itemsPerPage = 6;

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const read = (url) => {
    const key = url.split("/")[5];
    navigate(`/read?key=${key}`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (event, page) => {
    setPages(page);
  };

  const fetchBooks = async (category) => {
    setOpen(true);
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
          setCount(res.data.count);
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
    setOpen(false);
  };

  useEffect(() => {
    const category = location.search;
    fetchBooks(category);
    // eslint-disable-next-line
  }, [location, pages]);

  return (
    <div className="book-container">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Toaster />
      {/* if books.length===0 then shows No books found */}
      {books.length === 0 && (
        <div className="no-books">
          <h1>No Books Found!</h1>
        </div>
      )}
      <div className="totalBooks">
        Ocean Book is your search engine for PDF files. As of today we have{" "}
        <span>{numberWithCommas(count)}</span> eBooks for you to download for
        free. No annoying ads, no download limits, enjoy it and share the love!
      </div>
      {books?.map((book) => (
        <div className="book" key={book._id}>
          <div className="cover">
            <img src={book.image} alt="" className="bookCover" />
          </div>
          <div className="bookInfo">
            <div className="bookTitle">
              {book.title.length > 27
                ? book.title.slice(0, 24).concat("...")
                : book.title}
            </div>
            <div className="bookDesc">
              {book.description.length > 60
                ? book.description.slice(0, 60).concat("...")
                : book.description}
            </div>
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
              <button className="bookLink" onClick={() => read(book.bookUrl)}>
                Read
              </button>
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
