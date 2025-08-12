const getPost = (req, res) => {
    const { postTitle } = req.params;
    return res.send("Get Individual post")
};

const getBlogHome = (req, res) => {
    return res.send("Blog home");
};

const writePost = (req, res) => {
    const { postTitle } = req.params;
    return res.send("Write post");
};

const editPost = (req, res) => {
    const { postTitle } = req.params;
    return res.send("Edit Post");
};

const deletePost = (req, res) => {
    const { postTitle } = req.params;
    return res.send("delete post");
};

const postComment = (req, res) => {
    const { postTitle } = req.params;
    return res.send("post comment");
};

const editComment = (req, res) => {
    const { postTitle, commentId } = req.params;
    return res.send("edit comment");
};

module.exports = { getPost, getBlogHome, writePost, editPost, deletePost, postComment, editComment };