const model = require('../middleware/postgres')

let GET = `
    SELECT
        user_id,
        username,
        email
    FROM users;
`

let ONE = `
    SELECT 
        user_id,
        username,
        email
    FROM users
    WHERE user_id = $1;
`

let CREATE = `
    INSERT INTO users (username, password, email) VALUES 
    ($1, crypt($2, gen_salt('bf')), $3)
    RETURNING user_id, username;
`

let DELETE = `
    DELETE FROM users
    WHERE user_id = $1
    RETURNING user_id;
`

let UPDATE = `
    UPDATE users
    SET username = $2
    WHERE user_id = $1
    RETURNING *;
`

const getUsers = () => {
    return model(GET)
}

const getUser = (user_id) => {
    return model(ONE, user_id)
}

const createUser = (username, password, email) => {
    return model(CREATE, username, password, email)
}

const deleteUser = (user_id) => {
    return model(DELETE, user_id)
}

const updateUser = (user_id, username) => {
    return model(UPDATE, user_id, username)
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}