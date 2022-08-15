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
let onewithpassword = `
    SELECT 
        *
    FROM users
    WHERE user_id = $1;
`

let SEARCH = `
    SELECT
        *
    FROM users
    WHERE username ILIKE '%' || $1 ||'%';
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

let CHECK_PASSWORD = `
    SELECT
        CASE AS result
            WHEN password = crypt($2, gen_salt(password))
            THEN 'true'
            ELSE 'false'
        END
    FROM users
    WHERE user_id = $1;
`

let UPDATE = `
    UPDATE users
    SET username = $2,
        password = crypt($3, gen_salt('bf')),
        email = $4
    WHERE user_id = $1
    RETURNING *;
`
let UPDATE2 = `
    UPDATE users
    SET username = $2,
        email = $3
    WHERE user_id = $1
    RETURNING *;
`

const getUsers = () => {
    return model(GET)
}

const getUser = (user_id) => {
    return model(ONE, user_id)
}

const getUserWithPassword = (user_id) => {
    return model(onewithpassword, user_id)
}

const getUsersBySearch = (username) => {
    return model(SEARCH, username)
}

const createUser = (username, password, email) => {
    return model(CREATE, username, password, email)
}

const deleteUser = (user_id) => {
    return model(DELETE, user_id)
}

const updateUser = (user_id, username, password, email) => {
    console.log(user_id, username, password, email);

    return password ? model(UPDATE, user_id, username, password, email) : model(UPDATE2, user_id, username, email)
}

module.exports = {
    getUsers,
    getUser,
    getUsersBySearch,
    createUser,
    deleteUser,
    updateUser,
    getUserWithPassword
}