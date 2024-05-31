const express = require("express");
const {

    registerController,
    loginController,
    getAllUsersController,
    getAllAuthorsController,
    getUserController,
    getUserLikedBlogController,
    userLikedBlogController,
    userUnikedBlogController,
    getUserBlogController
} = require("../controllers/userController");

// router object
const router = express.Router();

router.get("/all-authors", getAllAuthorsController);

router.get("/all-users", getAllUsersController);

router.get("/single-user", getUserController);

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/user-blogs", getUserBlogController);

router.get("/like-blog", getUserLikedBlogController);
router.put("/like-blog", userLikedBlogController);
router.delete("/like-blog", userUnikedBlogController);


module.exports = router;