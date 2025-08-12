const postComment = (req, res) => {
    const { postTitle } = req.params;
    return res.send(`Created a comment on ${postTitle}`);
};

const editComment = (req, res) => {
    const { postTitle, commentId } = req.params;
    return res.send(`Edited comment ${commentId} on ${postTitle}`);
};

module.exports = { postComment, editComment };