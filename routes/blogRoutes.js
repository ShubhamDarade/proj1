const express = require("express");
const {
    getAllBlogsController,
    getBlogController,
    createBlogController,
    deleteBlogController,
    getAllUsersLikedBlogcontroller
} = require("../controllers/blogController");

// Router object
const router = express.Router();

// Routes

router.get("/all-blogs", getAllBlogsController);


router.get("/single-blog", getBlogController);
router.post("/single-blog", createBlogController);
// router.put("/single-blog", updateBlogController);
router.delete("/single-blog", deleteBlogController);

router.get("/liked-user", getAllUsersLikedBlogcontroller)

module.exports = router;
