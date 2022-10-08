const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    bookUrl: {
      type: String,
      required: true,
    },
    user: {
      type: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        isAdmin: Boolean,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
