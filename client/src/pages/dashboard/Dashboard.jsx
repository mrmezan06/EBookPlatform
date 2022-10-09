import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import "./dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const handleEditClick = (id) => {
    console.log("Edit", id - 1);
  };
  const handleDeleteClick = async (id) => {
    try {
      const bookId = rows[id - 1]._id;

      if (isAdmin) {
        await axios.delete(`/books/admin/${bookId}`).then((res) => {
          if (res.status === 200) {
            toast.success("Book Deleted Successfully");
            fetchData();
          } else {
            toast.error(res.data.message);
          }
        });
      } else {
        await axios.delete(`/books/user/${userId}/${bookId}`).then((res) => {
          if (res.status === 200) {
            toast.success("Book Deleted Successfully");
            fetchData();
          } else {
            toast.error(res.data.message);
          }
        });
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  // const columnsUser = [
  //   { field: "id", headerName: "ID", width: 100 },
  //   {
  //     field: "title",
  //     headerName: "Title",
  //     width: 320,
  //   },
  //   {
  //     field: "author",
  //     headerName: "Author",
  //     width: 190,
  //   },
  //   {
  //     field: "uploader",
  //     headerName: "Uploader",
  //     width: 190,
  //   },
  //   {
  //     field: "edit",
  //     headerName: "Edit",
  //     type: "actions",
  //     width: 160,
  //     getActions: ({ id }) => {
  //       return [
  //         <GridActionsCellItem
  //           icon={<FontAwesomeIcon icon={faPen} />}
  //           label="Edit"
  //           onClick={() => handleEditClick(id)}
  //         />,
  //       ];
  //     },
  //   },
  // ];

  const columnsAdmin = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Title",
      width: 300,
    },
    {
      field: "author",
      headerName: "Author",
      width: 160,
    },
    {
      field: "uploader",
      headerName: "Uploader",
      width: 150,
    },
    {
      field: "edit",
      headerName: "Edit",
      type: "actions",
      width: 150,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<FontAwesomeIcon icon={faPen} />}
            label="Edit"
            onClick={() => handleEditClick(id)}
          />,
        ];
      },
    },
    {
      field: "delete",
      type: "actions",
      headerName: "Delete",
      width: 150,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<FontAwesomeIcon icon={faTrash} />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  const [rows, setRows] = useState([]);
  const userId = localStorage.getItem("userID");

  const navigate = useNavigate();

  const [pageSize, setPageSize] = React.useState(0);

  const fetchData = async () => {
    if (!userId) {
      navigate("/login");
    }
    await axios
      .get(`/books/admin/${userId}`)
      .then((res) => {
        // console.log(res.data);
        setPageSize(res.data.count);
        setIsAdmin(res.data.isAdmin);
        // setBooks(res.data.books);
        var rw = [];
        if (res.data.books.length > 0) {
          res.data.books.map((book, i) =>
            rw.push({
              id: i + 1,
              title: book.title,
              author: book.author,
              uploader: book.user.name,
              _id: book._id,
            })
          );
          setRows(rw);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <Toaster />
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columnsAdmin}
          pageSize={9}
          rowsPerPageOptions={[pageSize]}
        />
      </Box>
    </div>
  );
};

export default Dashboard;
