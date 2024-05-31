const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");


//blog like by user


//create user register user
exports.registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(200).send({
                success: false,
                message: "Please fill all fields",
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "User already exists",
            });
        }

        // Create new user
        const newUser = new userModel({ name, email, password });
        await newUser.save();

        return res.status(201).send({
            success: true,
            message: "New user created",
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error in register",
            error: error.message,
        });
    }
};



//login
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(200).send({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "Email is not registered",
            });
        }

        // Check password
        // const isMatch = await compare(password, user.password);
        let isMatch = false
        if (password === user.password) {
            isMatch = true;
        }
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Login successful
        return res.status(200).send({
            success: true,
            message: "Login successful",
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error in login",
            error: error.message,
        });
    }
};





// get all users
exports.getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({}).populate('blogs').populate('likedblogs');

        if (users.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No users found",
                userCount: 0,
                users: [],
            });
        }

        return res.status(200).send({
            success: true,
            message: "All users data",
            userCount: users.length,
            users,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error in getting all users",
            error: error.message,
        });
    }
};




// get all authors
exports.getAllAuthorsController = async (req, res) => {
    try {
        const authors = await userModel.find({ 'blogs': { $exists: true, $not: { $size: 0 } } })
            .populate('blogs')
            .populate('likedblogs');

        if (authors.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No authors found",
                authorCount: 0,
                authors: [],
            });
        }

        return res.status(200).send({
            success: true,
            message: "All authors data",
            authorCount: authors.length,
            authors,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error in getting all authors",
            error: error.message,
        });
    }
};




// get user
exports.getUserController = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userModel.findById(id).populate('blogs').populate('likedblogs');
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "user not found with this ID",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Single user fetch successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while getting single user",
            error: error.message,
        });
    }
};



// all blogs liked by user
exports.getUserLikedBlogController = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userModel.findById(id).populate('likedblogs');

        if (!user || user.likedblogs.length === 0) {
            return res.status(200).send({
                success: true,
                message: "User hasn't liked any blog",
                blogCount: 0,
                blogs: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "All blogs liked by user fetched successfully",
            blogCount: user.likedblogs.length,
            blogs: user.likedblogs
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while getting user liked blogs",
            error: error.message,
        });
    }
};







// user liked single blog
exports.userLikedBlogController = async (req, res) => {
    try {
        const { userId, blogId } = req.body;

        const user = await userModel.findById(userId)
        const blog = await blogModel.findById(blogId)

        if (user.likedblogs.includes(blogId)) {
            return res.status(200).send({
                success: true,
                message: "User has already liked this blog",
                user,
                blog
            });
        }
        user.likedblogs.push(blogId)
        user.save()

        blog.userlikes.push(userId)
        blog.save()

        return res.status(200).json({
            success: true,
            message: "Blog liked successfully",
            user,
            blog
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while adding user liked blog",
            error: error.message,
        });
    }
};





// user Unliked single blog
exports.userUnikedBlogController = async (req, res) => {
    try {
        const { userId, blogId } = req.body;

        const user = await userModel.findById(userId)
        const blog = await blogModel.findById(blogId)

        user.likedblogs.pull(blogId)
        user.save()

        blog.userlikes.pull(userId)
        blog.save()

        return res.status(200).json({
            success: true,
            message: "Blog Unliked successfully",
            user,
            blog
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while unliking blog",
            error: error.message,
        });
    }
};





// all user blogs
exports.getUserBlogController = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userModel.findById(id).populate('blogs');

        if (!user || user.blogs.length === 0) {
            return res.status(200).send({
                success: true,
                message: "User hasn't created any blog",
                blogCount: 0,
                blogs: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "All user blogs fetched successfully",
            blogCount: user.blogs.length,
            blogs: user.blogs
        });
    } catch (error) {
        console.error(error);
        return res.status(200).send({
            success: false,
            message: "Error while getting userblogs",
            error: error.message,
        });
    }
};