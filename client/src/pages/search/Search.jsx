import React from "react";
import { useEffect } from "react";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import "./search.css";
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
    <>
      <div className="searchInput">
        <input
          type="text"
          placeholder="🔍 Search books by title or anything else..."
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
    </>
  );
};

export default Search;
