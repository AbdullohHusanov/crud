const model = require('../middleware/postgres')

let GET = `
    SELECT
        c.comment_id,
        u.username,
        p.title,
        c.comment_text
    FROM comments AS c
    JOIN posts AS p ON c.post_id = p.post_id 
    JOIN users AS u ON u.user_id = c.user_id;
`

let BY_POST_ID = `
    SELECT
    *
    FROM comments
    WHERE post_id = $1;
`

let BY_USER_ID = `
    SELECT
    *
    FROM comments
    WHERE user_id = $1;
`

let ONE = `
    SELECT
        c.comment_id,
        u.username,
        u.user_id,
        p.title,
        c.comment_text
    FROM comments AS c
    JOIN posts AS p ON c.post_id = p.post_id 
    JOIN users AS u ON u.user_id = c.user_id
    WHERE comment_id = $1;
`

let CREATE = `
    INSERT INTO comments (user_id, post_id, comment_text) VALUES 
    ($1, $2, $3)
    RETURNING user_id, comment_text;
`

let DELETE = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING comment_id;
`

let UPDATE = `
    UPDATE comments
    SET comment_text = $2
    WHERE comment_id = $1
    RETURNING *;
`

const getComments = () => {
    return model(GET)
}

const getComment = (comment_id) => {
    return model(ONE, comment_id)
}

const getCommentsByPostId = (post_id) => {
    return model(BY_POST_ID, post_id)
}

const getCommentsByUserId = (user_id) => {
    return model(BY_USER_ID, user_id)
}

const createComment = (user_id, post_id, comment_text) => {
    return model(CREATE, user_id, post_id, comment_text)
}

const deleteComment = (comment_id) => {
    return model(DELETE, comment_id)
}

const updateComment = (comment_id, comment_text) => {
    return model(UPDATE, post_id, comment_id, comment_text)
}

module.exports = {
    getComments,
    getComment,
    getCommentsByPostId,
    getCommentsByUserId,
    createComment,
    deleteComment,
    updateComment
}