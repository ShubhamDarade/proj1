const express = require("express");
const {
    getCommentController,
    createCommentController
} = require("../controllers/commentController");

// router object
const router = express.Router();

router.get("/blog-comment", getCommentController);
router.post("/blog-comment", createCommentController);

module.exports = router;