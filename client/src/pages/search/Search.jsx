import React from "react";
import { useEffect } from "react";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
// import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "./search.css";
import UserMenu from "../../components/userMenu/UserMenu";
import { Pagination, Box } from "@mui/material";

const Search = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const [books, setBooks] = useState([]);
  const [pageSize, setPageSize] = useState(1);

  const [pages, setPages] = useState(1);

  const itemsPerPage = 3;

  const handlePageChange = (event, page) => {
    setPages(page);
  };

  const fetchBooks = async () => {
    try {
      // console.log(category);
      await axios
        .get(
          `/books/search?title=${searchTerm}&page=${pages}&items=${itemsPerPage}`
        )
        .then((res) => {
          setBooks(res.data.books);
          setPageSize(res.data.pageCount);

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
    fetchBooks();
    // eslint-disable-next-line
  }, [searchTerm, pages]);

  return (
    <div className="app">
      {/* <Navbar /> */}
      {/* Navbar */}
      <div className="navContainer">
        <div className="logo">
          <Link className="link" to="/">
            <FontAwesomeIcon icon={faHouse} className="fIcon" />
          </Link>
        </div>

        <div className="menu">
          <Link to="/?cat=programming" className="link">
            Programming
          </Link>
          <Link to="/?cat=science" className="link">
            Science
          </Link>
          <Link to="/?cat=math" className="link">
            Math
          </Link>
          <Link to="/?cat=history" className="link">
            History
          </Link>
          {/* depends on showSearch a search input visible or hide */}
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search for books"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>

          <div className="userLogo">
            <UserMenu className="link" />
          </div>
        </div>
      </div>
      {/* End Navbar */}
      <div className="main-container">
        <div className="book-container">
          <Toaster />
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
      </div>
      <Footer />
    </div>
  );
};

export default Search;
