require('dotenv').config()
const jwt = require('jsonwebtoken')
const joi = require('joi')

const Trim = (req, res, next) => {
    let {
        title, 
        description, 
        username, 
        password, 
        email, 
        comment_text
        } = req.body

    if (
        (title && typeof title === 'string') || 
        (description && typeof description === 'string')|| 
        (username && typeof username === 'string') || 
        (password && typeof password === 'string') || 
        (email && typeof email === 'string') || 
        (comment_text && typeof comment_text === 'string')
        ) {
            req.body.title = title ? title.trim() : undefined
            req.body.description = description ? description.trim() : undefined
            
            req.body.username = username ? username.trim() : undefined
            req.body.password = password ? password.trim() : undefined
            req.body.email = email ? email.trim() : undefined
            
            req.body.comment_text = comment_text ? comment_text.trim() : undefined
        
            return next()
    } else {
        res.status(400).json({
            message: 'data not found please write something '
        })
    }
}

const CheckToken = (req, res, next) => {
    try {
        let { token } = req.headers
    
        if(token) {
            let { username, user_id } = jwt.verify(token, process.env.SECRET_KEY_4JWT)
    
            if(username && user_id) {
                return next()
            } else {
                res.json({
                    message: 'invalid token'
                })
            }
        } else {
            res.json({
                message: 'token not found'
            })
        }
    } catch (error) {
        console.log(error);
    }
}

// users validation middlewares

const UserValidator = joi.object({
    username: joi.string().min(3).max(15).alphanum().required(),
    password: joi.string().min(6).max(18).pattern(new RegExp(/(?=.*[a-z]+)(?=.*[0-9]+)/)).required(),
    email: joi.string().min(3).max(30).pattern(new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)).required()
})

// posts validation middlewares

const PostValidator = joi.object({
    title: joi.string().min(4).max(32).required(),
    description: joi.string().min(5).max(128).required(),
})

// comments validation middlewares

const CommentValidator = joi.object({
    post_id: joi.number().required(),
    comment_text: joi.string().min(5).max(64).required()
})

// users validation middlewares

const UserValidation = (req, res, next) => {
    const { value, error } = UserValidator.validate(req.body)
    return error ? next(error) : next()
}

const UserValidation4Update = (req, res, next) => {
    let {username, password, email} = req.body

    if (username || password || email) {
        username = (username && typeof username === 'string' && username.length >= 3 && username.length <= 15) ? username : undefined
        password = (password && typeof password === 'string' && password.length >= 3 && password.length <= 15 && /(?=.*[a-z]+)(?=.*[0-9]+)/.test(password)) ? password : undefined
        email = (email && typeof email === 'string' && email.length >= 3 && email.length <= 15 && /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) ? email : undefined
        
        if (username || password || email) {
            return next()
        } else {
            res.json({
                message: 'wrong username or password or email'
            })
        }
    } else {
        res.status(400).json({
            message: 'data not found please write something '
        })
    }
}

// posts validation middlewares


const PostValidation = (req, res, next) => {
    const { value, error } = PostValidator.validate(req.body)
    return error ? next(error) : next()
}

const PostValidation4Update = (req, res, next) => {
    let {title, description} = req.body

    if (title || description) {
        title = (title && typeof title === 'string' && title.length >= 4 && title.length <= 32) ? title : undefined
        description = (description && typeof description === 'string' && description.length >= 5 && description.length <= 128 ) ? description : undefined
        
        if (title || description) {
            return next()
        } else {
            res.json({
                message: 'wrong title or description'
            })
        }
    } else {
        res.status(400).json({
            message: 'data not found please write something '
        })
    }
}

// comments validation middlewares

const CommentValidation = () => {
    const { value, error } = CommentValidator.validate(req.body)
    return error ? next(error) : next()
}

const CommentValidation4Update = () => {
    let {post_id, comment_text} = req.body

    if (post_id || comment_text) {
        post_id = (post_id && typeof post_id === 'number') ? post_id : undefined
        comment_text = (comment_text && typeof comment_text === 'string' && comment_text.length >= 5 && comment_text.length <= 64 ) ? comment_text : undefined
        
        if (post_id || comment_text) {
            return next()
        } else {
            res.json({
                message: 'wrong title or description'
            })
        }
    } else {
        res.status(400).json({
            message: 'data not found please write something '
        })
    }
}

module.exports = {
    Trim,
    CheckToken,
    UserValidation,
    UserValidation4Update,
    PostValidation,
    PostValidation4Update,
    CommentValidation,
    CommentValidation4Update
}