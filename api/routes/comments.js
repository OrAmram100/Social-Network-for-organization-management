const router = require("express").Router();
const Comment = require("../models/Comment");

//save comment
router.post("/", async (req,res)=>{
    const newComment = new Comment(req.body)
    try {
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get post's comments
router.get("/", async(req, res) => {
    const postId = req.query.postId;
    try {
        const comments = await Comment.find({ postId: postId });;
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});
//delete post comments
router.delete("/:id", async(req, res) => {
    try {
        const comments = await Comment.deleteMany({ postId: req.params.id });
        res.status(200).json("the comments have been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;