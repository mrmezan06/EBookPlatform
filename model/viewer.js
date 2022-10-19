const mongoose = require("mongoose");

const viewerSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 1,
    },
    bookViewCount: {
      type: [
        {
          bookId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          count: {
            type: Number,
            default: 1,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Viewer", viewerSchema);
