const jwt = require('jsonwebtoken')
const commentsModel = require('../models/comments.model')
const postsModel = require('../models/posts.model')
const usersModel = require('../models/users.model')
require('dotenv').config()

const getComments = async (req, res) => {

    if(req.query.post_id) {
        let comments = await commentsModel.getCommentsByPostId(req.query.post_id)
        
        if (comments.length) {
            res.status(201).json({
                data: comments
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'not found'
            })
        }
    } else if (req.query.user_id) {
        let comments = await commentsModel.getCommentsByUserId(req.query.user_id)
        
        if (comments.length) {
            res.status(201).json({
                data: comments
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'not found'
            })
        }
    } else {
        let comments = await commentsModel.getComments()
    
        res.json({
            data: comments
        })
    }

}

const getComment = async (req, res) => {
    let { comment_id } = req.params
    let comment = await commentsModel.getComment(comment_id)
    
    if (comment) {
        res.json({
            data: comment
        })
    }
}

const createComment = async (req, res) => {
    let { comment_text, post_id } = req.body
    let { token } = req.headers

    let { user_id } = jwt.verify(token, process.env.SECRET_KEY_4JWT)
    let post = await postsModel.getPost(post_id)
    let user = await usersModel.getUser(user_id)

    if (post.length && user.length) {
        let newComment = await commentsModel.createComment(user_id, post_id, comment_text)

        res.status(201).json({
            message: 'Post succesfully created',
            data: newComment
        })
    } else {
        res.status(400).json({
            message: 'post or user not found'
        })
    }

}

const deleteComment = async (req, res) => {
    let { comment_id }  = req.params
    let { token } = req.headers

    let { user_id } = jwt.verify(token, process.env.SECRET_KEY_4JWT)
    let comment = await commentsModel.getComment(comment_id)

    if((user_id && comment.length) && user_id == comment[0].user_id) {

        let deletedComment = await commentsModel.deleteComment(comment_id)
    
        if( deletedComment.length ) {
            
            res.json({
                message: 'Comment succesfully deleted'
            })
        }
    } else {
        res.json({
            message: 'You can\'t delete this comment because you didn\'t write it'
        }).status(400)
    }

}

const updateComment = async (req, res) => {
    let { comment_id } = req.params
    let { post_id, comment_text } = req.body

    let { token } = req.headers

    let { user_id } = jwt.verify(token, process.env.SECRET_KEY_4JWT)
    let comment = await commentsModel.getComment(comment_id)

    if((user_id && comment.length) && user_id == comment[0].user_id) {
        post_id = post_id ? post_id : comment[0].post_id
        comment_text = comment_text ? comment_text : comment[0].comment_text
        let updatedComment = await commentsModel.updateComment(comment_id, post_id, comment_text)
    
        if( updatedComment.length ) {
            
            res.json({
                message: 'Comment succesfully updated',
                data: updatedComment
            })
        }
        
    } else {
        res.json({
            message: 'You can\'t update this comment, because you didn\'t write it'
        }).status(400)
    }
}

module.exports = {
    getComment,
    getComments,
    createComment,
    deleteComment,
    updateComment
}