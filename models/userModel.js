const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        blogs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog",
            },
        ],
        likedblogs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog",
            },
        ],
    }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
