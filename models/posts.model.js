const model = require('../middleware/postgres')

let GET = `
    SELECT
        p.post_id,
        u.username AS user,
        p.title,
        p.description
    FROM posts AS p
    NATURAL JOIN users AS u 
    ORDER BY p.post_id;
`

let ONE = `
    SELECT 
        p.post_id,
        u.username,
        u.user_id,
        p.title,
        p.description
    FROM posts AS p
    NATURAL JOIN users AS u
    WHERE post_id = $1;
`

let BY_USER_ID = `
    SELECT 
        p.post_id,
        u.username,
        p.title,
        p.description
    FROM posts AS p
    NATURAL JOIN users AS u
    WHERE p.user_id = $1;
`

let CREATE = `
    INSERT INTO posts (title, description, user_id) VALUES 
    ($1, $2, $3)
    RETURNING *;
`

let DELETE = `
    DELETE FROM posts
    WHERE post_id = $1
    RETURNING post_id;
`

let UPDATE = `
    UPDATE posts
        SET title = $2
        SET description = $3
    WHERE post_id = $1
    RETURNING *;
`

const getPosts = () => {
    return model(GET)
}

const getPost = (post_id) => {
    return model(ONE, post_id)
}

const createPost = (title, description, user_id) => {
    return model(CREATE, title, description, user_id)
}

const deletePost = (post_id) => {
    return model(DELETE, post_id)
}

const updatePost = (post_id, title, description) => {
    return model(UPDATE, post_id, title, description)
}

const byUserId = (user_id) => {
    return model(BY_USER_ID, user_id)
}

module.exports = {
    getPosts,
    getPost,
    createPost,
    deletePost,
    updatePost,
    byUserId
}