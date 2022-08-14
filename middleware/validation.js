require('dotenv').config()
const jwt = require('jsonwebtoken')
const joi = require('joi')

const Trim = (req, res, next) => {
    if(req.body.title && req.body.description) {
        req.body.title = req.body.title.trim()
        req.body.description = req.body.description.trim()

        return next()
    } 
    else if (req.body.username && req.body.password && req.body.email) {
        req.body.username = req.body.username.trim()
        req.body.password = req.body.password.trim()
        req.body.email = req.body.email.trim()

        return next()
    }
    else if (req.body.comment_text) {
        req.body.comment_text = req.body.comment_text.trim()
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

const UserValidator4Update = joi.object({
    username: joi.string().min(3).max(15).alphanum(),
    password: joi.string().min(6).max(18).pattern(new RegExp(/(?=.*[a-z]+)(?=.*[0-9]+)/)),
    email: joi.string().min(3).max(30).pattern(new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/))
})

// posts validation middlewares

const PostValidator = joi.object({
    title: joi.string().min(4).max(32).required(),
    description: joi.string().min(5).max(128).required(),
})

const PostValidator4Update = joi.object({
    title: joi.string().min(4).max(32),
    description: joi.string().min(5).max(128)
})

// comments validation middlewares

const CommentValidator = joi.object({
    post_id: joi.number().required(),
    comment_text: joi.string().min(5).max(64).required()
})

const CommentValidator4Update = joi.object({
    post_id: joi.number(),
    comment_text: joi.string().min(5).max(64)
})

// users validation middlewares

const UserValidation = (req, res, next) => {
    const { value, error } = UserValidator.validate(req.body)
    return error ? next(error) : next()
}

const UserValidation4Update = (req, res, next) => {
    const { value, error } = UserValidator4Update.validate(req.body)
    return error ? next(error) : next()
}

// posts validation middlewares


const PostValidation = (req, res, next) => {
    const { value, error } = PostValidator.validate(req.body)
    return error ? next(error) : next()
}

const PostValidation4Update = (req, res, next) => {
    const { value, error } = PostValidator4Update.validate(req.body)
    return error ? next(error) : next()
}

// comments validation middlewares

const CommentValidation = () => {
    const { value, error } = CommentValidator.validate(req.body)
    return error ? next(error) : next()
}

const CommentValidation4Update = () => {
    const { value, error } = CommentValidator4Update.validate(req.body)
    return error ? next(error) : next()
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