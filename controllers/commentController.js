const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel")


// get blog comments
exports.getCommentController = async (req, res) => {
    try {

        const { blogId } = req.body;

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(200).json({
                success: false,
                message: "Blog not found",
                commentCount: 0,
                comments: [],
            });
        }

        const comments = await commentModel.find({ blog: blogId }).populate('user');

        const commentCount = comments.length;

        if (commentCount === 0) {
            return res.status(200).send({
                success: true,
                message: "No comments found",
                commentCount: 0,
                comments: [],
            });
        }

        return res.status(200).send({
            success: true,
            message: "comments fetch succesfully",
            commentCount,
            comments,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while getting comments",
            error: error.message,
        });
    }
};



// create comment
exports.createCommentController = async (req, res) => {
    try {

        const { content, user, blog } = req.body;

        // Validation
        if (!content || !user || !blog) {
            return res.status(200).send({
                success: false,
                message: "Please fill all fields",
            });
        }


        // Create new user
        const newComment = new commentModel({ content, user, blog });
        await newComment.save();

        return res.status(201).send({
            success: true,
            message: "New comment created",
            comment: newComment,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error in creating comment",
            error: error.message,
        });
    }
};