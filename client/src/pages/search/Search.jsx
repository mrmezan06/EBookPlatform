import React from "react";
import { useEffect } from "react";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { Pagination, Box } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./search.css";
import numberWithCommas from "../../utils/commaSeperated";
import { useNavigate } from "react-router-dom";
import kmbSeperator from "../../utils/kmbSeperator";

const Search = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const [books, setBooks] = useState([]);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(1);

  const [pages, setPages] = useState(1);

  const itemsPerPage = 6;
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const handlePageChange = (event, page) => {
    setPages(page);
  };

  const fetchBooks = async () => {
    setOpen(true);
    try {
      await axios
        .get(
          `/books/search?title=${searchTerm}&page=${pages}&items=${itemsPerPage}`
        )
        .then((res) => {
          setBooks(res.data.books);
          setPageSize(res.data.pageCount);
          setCount(res.data.count);
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

  const [ftitle, setFtitle] = useState(true);
  const [vCount, setVCount] = useState(1);

  const AddViewerAndGetViewCount = async (id) => {
    try {
      await axios
        .post(`/count`, { bookId: id })
        .then((res) => {
          setVCount(res.data.count);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const read = (url, id) => {
    AddViewerAndGetViewCount(id);
    const key = url.split("/")[5];
    navigate(`/read?key=${key}`);
  };

  useEffect(() => {
    fetchBooks();
    AddViewerAndGetViewCount();

    if (window.innerWidth < 1024) {
      setFtitle(false);
    } else {
      setFtitle(true);
    }
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setFtitle(false);
      } else {
        setFtitle(true);
      }
    };
    window.addEventListener("resize", handleResize);

    // eslint-disable-next-line
  }, [searchTerm, pages]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="searchInput">
        <input
          type="text"
          placeholder="???? Search books by title or anything else..."
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
      <div className="book-container">
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
          free. No annoying ads, no download limits, enjoy it and share the
          love! We have a total of <span>{kmbSeperator(vCount)}</span> visitors
          on this website.
        </div>
        {books?.map((book) => (
          <div className="book" key={book._id}>
            <div className="cover">
              <img src={book.image} alt="" className="bookCover" />
            </div>
            <div className="bookInfo">
              <div className="bookTitle">
                {ftitle
                  ? book.title
                  : book.title.length > 27
                  ? book.title.slice(0, 24).concat("...")
                  : book.title}
              </div>
              <div className="bookDesc">
                {ftitle
                  ? book.description
                  : book.description.length > 60
                  ? book.description.slice(0, 60).concat("...")
                  : book.description}
              </div>
              <div className="bookAuthor">
                Author: <span>{book.author}</span>
              </div>
              <div className="bookUploader">
                Uploader: <span>{book.user.name}</span>
              </div>
              <div className="bookButtons">
                <button
                  className="bookLink"
                  onClick={() => read(book.bookUrl, book._id)}
                >
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
      </div>
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
    </>
  );
};

export default Search;
