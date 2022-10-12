const Book = require("../model/book");
const User = require("../model/user");
const mongoose = require("mongoose");

exports.Upload = async (req, res) => {
  try {
    const { title, author, description, category, image, bookUrl } = req.body;
    const lowCat = category.map((cat) => cat.replaceAll(" ", "").toLowerCase());
    const _id = mongoose.mongo.ObjectId(req.params.uid);

    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const book = await Book.create({
      title,
      author,
      description,
      category: lowCat,
      image,
      bookUrl,
      user: { _id: user._id, name: user.name, isAdmin: user.isAdmin },
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.GetBooks = async (req, res) => {
  try {
    const query = req.query.cat;
    const ITEMS_PER_PAGE = req.query.items || 3;
    const page = req.query.page || 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // count the number of books

    const loQuery = query?.toLowerCase();
    if (loQuery) {
      // based Query
      const count = await Book.countDocuments({ category: loQuery });
      const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

      const books = await Book.find({ category: loQuery })
        .limit(ITEMS_PER_PAGE)
        .skip(skip)
        .sort({
          createdAt: "desc",
        });
      res.status(200).json({ books, pageCount, count });
    } else {
      const count = await Book.countDocuments();
      const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

      const books = await Book.find().limit(ITEMS_PER_PAGE).skip(skip).sort({
        createdAt: "desc",
      });
      res.status(200).json({ books, pageCount, count });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

// Update a book
exports.UpdateBook = async (req, res) => {
  try {
    const uid = req.params.uid;
    const bid = req.params.id;
    const book = await Book.findById(bid);
    if (book) {
      const user = await User.findById(uid);
      if (user) {
        if (uid === book.user._id.toString() || user.isAdmin) {
          const { title, author, description, category, image, bookUrl } =
            req.body;
          const lowCat = category.map((cat) =>
            cat.replaceAll(" ", "").toLowerCase()
          );

          const updatedBook = await Book.findByIdAndUpdate(
            bid,
            {
              title,
              author,
              description,
              category: lowCat,
              image,
              bookUrl,
            },
            { new: true }
          );
          res.status(200).json(updatedBook);
        } else {
          res.status(400).json({
            message: "You don't have permission to update this book",
          });
        }
      } else {
        res.status(400).json({
          message: "User not found",
        });
      }
    } else {
      res.status(404).json({ message: "Book not found!" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Delete a book
exports.DeleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

// Search a book by title or category
exports.SearchBook = async (req, res) => {
  const title = req.query.title;
  const ITEMS_PER_PAGE = req.query.items || 3;
  const page = req.query.page || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  try {
    var count = await Book.countDocuments({
      title: { $regex: title, $options: "i" },
    });
    var pageCount = Math.ceil(count / ITEMS_PER_PAGE);

    const books = await Book.find({
      title: { $regex: title, $options: "i" },
    })
      .limit(ITEMS_PER_PAGE)
      .skip(skip)
      .sort({ createdAt: "desc" });

    if (books.length === 0) {
      count = await Book.countDocuments({
        category: { $regex: title, $options: "i" },
      });
      pageCount = Math.ceil(count / ITEMS_PER_PAGE);

      const books = await Book.find({
        category: { $regex: title, $options: "i" },
      })
        .limit(ITEMS_PER_PAGE)
        .skip(skip)
        .sort({ createdAt: "desc" });

      if (books.length === 0) {
        count = await Book.countDocuments({
          description: { $regex: title, $options: "i" },
        });
        pageCount = Math.ceil(count / ITEMS_PER_PAGE);

        const books = await Book.find({
          description: { $regex: title, $options: "i" },
        })
          .limit(ITEMS_PER_PAGE)
          .skip(skip)
          .sort({ createdAt: "desc" });
        if (books.length === 0) {
          count = await Book.countDocuments({
            author: { $regex: title, $options: "i" },
          });
          pageCount = Math.ceil(count / ITEMS_PER_PAGE);

          const books = await Book.find({
            author: { $regex: title, $options: "i" },
          })
            .limit(ITEMS_PER_PAGE)
            .skip(skip)
            .sort({ createdAt: "desc" });

          res.status(200).json({ books, pageCount, count });
        } else {
          res.status(200).json({ books, pageCount, count });
        }
      } else {
        res.status(200).json({ books, pageCount, count });
      }
    } else {
      res.status(200).json({ books, pageCount, count });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

// Get All Books by Admin
exports.GetAllBooks = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user?.isAdmin) {
      const books = await Book.find();
      const count = await Book.countDocuments();
      res.status(200).json({ count, books, isAdmin: user?.isAdmin });
    } else {
      // find where book.user._id === req.params.id
      const books = await Book.find();
      const uid = req.params.id;

      const MyBook = books.filter((book) => book.user?._id == uid);
      const count = MyBook.length;
      res.status(200).json({ count, books: MyBook, isAdmin: user?.isAdmin });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete a book by User by Book Id
exports.DeleteBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      if (req.params.uid === book.user._id.toString()) {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Book deleted successfully!" });
      } else {
        res
          .status(400)
          .json({ message: "You don't have permission to delete this book" });
      }
    } else {
      res.status(404).json({ message: "Book not found!" });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// Delete by Admin
exports.DeleteBookByAdmin = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Get a book by Id
exports.GetBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found!" });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
