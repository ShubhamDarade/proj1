const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel")

// get all blogs
exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({}).populate('author').populate('userlikes');

        if (blogs.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No blogs found",
                blogCount: 0,
                blogs: [],
            });
        }

        return res.status(200).send({
            success: true,
            message: "All blogs list",
            blogCount: blogs.length,
            blogs,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while getting all blogs",
            error: error.message,
        });
    }
};

// get blog
exports.getBlogController = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await blogModel.findById(id).populate('author').populate('userlikes');
        if (!blog) {
            return res.status(200).send({
                success: false,
                message: "Blog not found with this ID",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Single blog fetch successfully",
            blog,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while getting single blogs",
            error: error.message,
        });
    }
};

// create blog
exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, author } = req.body;

        // Validation
        if (!title || !description || !image || !author) {
            return res.status(200).send({
                success: false,
                message: "Please provide all fields",
            });
        }

        // Check if the user exists
        const user = await userModel.findById(author);
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "Unable to find user",
            });
        }

        // Create a new blog
        const newBlog = new blogModel({ title, description, image, author });
        await newBlog.save()

        user.blogs.push(newBlog)
        await user.save()

        // Send response
        return res.status(201).send({
            success: true,
            message: "Blog created!",
            newBlog,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while creating blog",
            error: error.message,
        });
    }
};



// exports.updateBlogController = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Check if id is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Invalid blog ID",
//             });
//         }

//         // Proceed with updating the blog
//         const updatedBlog = await blogModel.findByIdAndUpdate(
//             id,
//             { ...req.body },
//             { new: true }
//         );

//         if (!updatedBlog) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Blog not found with this ID",
//             });
//         }

//         return res.status(200).send({
//             success: true,
//             message: "Blog updated successfully",
//             blog: updatedBlog,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({
//             success: false,
//             message: "Error while updating blog",
//             error: error.message,
//         });
//     }
// };



//Delete Blog
exports.deleteBlogController = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await blogModel.findById(id).populate('author').populate('userlikes');

        if (!blog) {
            return res.status(200).send({
                success: false,
                message: "Blog not found",
            });
        }

        for (const userId of blog.userlikes) {
            const user = await userModel.findById(userId);
            if (user) {
                user.likedblogs.pull(blog);
                await user.save();
            }
        }

        const authorId = blog.author
        const author = await userModel.findById(authorId)
        author.blogs.pull(blog)
        await author.save()

        await commentModel.deleteMany({ blog: id })

        await blog.deleteOne();

        return res.status(200).send({
            success: true,
            message: "Blog deleted",
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while deleting blog",
            error: error.message,
        });
    }
};








// all users who liked blog
exports.getAllUsersLikedBlogcontroller = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await blogModel.findById(id).populate('userlikes');

        if (!blog || blog.userlikes.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No one has liked blog",
                userCount: 0,
                users: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "All users who liked blog fetched successfully",
            userCount: blog.userlikes.length,
            users: blog.userlikes
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while getting users who liked blog",
            error: error.message,
        });
    }
};
