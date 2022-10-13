const {
  Upload,
  GetBooks,

  UpdateBook,
  SearchBook,
  GetAllBooks,
  DeleteBookById,
  DeleteBookByAdmin,
  GetBookById,
} = require("../controller/bookController");
const { verifyAdmin, verifyUser } = require("../utils/Verify");

const router = require("express").Router();

router.post("/upload/:uid", verifyUser, Upload);
router.get("/getBooks", GetBooks);

// Update by User
router.put("/update/:uid/:id", verifyUser, UpdateBook);

// Search book by title
router.get("/search/", SearchBook);
// Get All Books by Admin || Get All Books by User
router.get("/admin/:id", GetAllBooks);
// Delete by User
router.delete("/user/:uid/:id", verifyUser, DeleteBookById);
// Delete by Admin
router.delete("/admin/:id", verifyAdmin, DeleteBookByAdmin);
router.get("/edit/:id", GetBookById);

module.exports = router;
