import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import "./dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Dashboard = () => {
  const [userStatus, setUserStatus] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = (id) => {
    navigate(`/edit/${rows[id - 1]._id}`);
  };
  const handleDeleteClick = async (id) => {
    setOpen(true);
    try {
      const bookId = rows[id - 1]._id;
      await axios.delete(`/books/user/${userId}/${bookId}`).then((res) => {
        if (res.status === 200) {
          toast.success("Book Deleted Successfully");
          fetchData();
        } else {
          toast.error(res.data.message);
        }
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setOpen(false);
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

  const [pageSize, setPageSize] = React.useState(0);

  const fetchData = async () => {
    if (!userId) {
      navigate("/login");
    }
    setOpen(true);
    await axios
      .get(`/books/admin/${userId}`)
      .then((res) => {
        // console.log(res.data);
        setPageSize(res.data.count);

        setUserStatus(res.data.status);
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
        toast.error(err.response.data.message || err.message);
      });
    setOpen(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <div className="dashboard">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <h1>Dashboard - {userStatus.toUpperCase()}</h1>
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
