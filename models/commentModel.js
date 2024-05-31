const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: [true, "Blog ID is required"],
        },
    }
);

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;

