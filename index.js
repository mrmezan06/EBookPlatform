const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cokieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const path = require("path");

// ViewSchema
const Viewer = require("./model/viewer");

dotenv.config();

const app = express();

app.use(cors({ origin: "https://ocean-book.herokuapp.com/" }));

app.use(express.json());
app.use(cokieParser());

app.use("/auth", userRoutes);
app.use("/books", bookRoutes);

// Count Viewers
app.post("/count", async (req, res) => {
  const { bookId } = req.body;
  try {
    if (bookId) {
      // Check if bookId exists in bookViewCount array
      const bookViewCount = await Viewer.findOne({
        bookViewCount: { $elemMatch: { bookId } },
      });
      // If it does, increment count
      if (bookViewCount) {
        await Viewer.updateOne(
          { bookViewCount: { $elemMatch: { bookId } } },
          { $inc: { "bookViewCount.$.count": 1, count: 1 } },
          { new: true }
        );
      } else {
        // If it doesn't, add bookId to bookViewCount array and set count to 1
        await Viewer.findOneAndUpdate(
          {},
          {
            $push: { bookViewCount: { bookId, count: 1 } },
            $inc: { count: 1 },
          },
          { new: true }
        );
      }
    } else {
      await Viewer.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
    }
    const viewer = await Viewer.findOne({});
    res.status(200).json(viewer);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Heroku Configuration
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
});
