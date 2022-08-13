require('dotenv').config()
const jwt = require('jsonwebtoken')
const joi = require('joi')

const Trim = (req, res, next) => {
    if(req.body.title && req.body.description) {
        req.body.title = req.body.title.trim()
        req.body.description = req.body.description.trim()

        next()
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

const UserValidator = joi.object({
    username: joi.string().min(3).max(15).alphanum().required(),
    password: joi.string().min(6).max(18).pattern(new RegExp(/(?=.*[a-z]+)(?=.*[0-9]+)/)).required(),
    email: joi.string().min(3).max(30).pattern(new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)).required()
})

const PostValidator = joi.object({
    title: joi.string().min(4).max(32).required(),
    description: joi.string().min(5).max(128).required(),
})

const PostValidator4Update = joi.object({
    title: joi.string().min(4).max(32),
    description: joi.string().min(5).max(128)
})

const UserValidation = (req, res, next) => {
    const { value, error } = UserValidator.validate(req.body)
    return error ? next(error) : next()
}

const PostValidation = (req, res, next) => {
    const { value, error } = PostValidator.validate(req.body)
    return error ? next(error) : next()
}
const PostValidation4Update = (req, res, next) => {
    const { value, error } = PostValidator4Update.validate(req.body)
    return error ? next(error) : next()
}

module.exports = {
    Trim,
    CheckToken,
    UserValidation,
    PostValidation,
    PostValidation4Update
}