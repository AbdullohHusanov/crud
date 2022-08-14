const jwt = require('jsonwebtoken')
const postsModel = require('../models/posts.model')
const usersModel = require('../models/users.model')
const commentsModel = require('../models/comments.model')
require('dotenv').config()

const c2p = async (posts) => {
    for(let post of posts) {
        let comments = await commentsModel.getCommentsByPostId(post.post_id)
        post.comments = comments
    }
    return posts
}

const getPosts = async (req, res) => {

    if (req.query.user_id) {
        let posts = await postsModel.byUserId(req.query.user_id)
        
        if( posts.length ) {
            posts = await c2p(posts)
            res.status(201).json({
                data: posts
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'not found'
            })
        }
    } else {
        let posts = await postsModel.getPosts()
    
        if(posts.length ) {
            posts = await c2p(posts)
            res.json({
                data: posts
            })
        } else { 
            res.json({
                status: 404,
                message: 'not found'
            })
        }
    }

}

const getPost = async (req, res) => {
    let { post_id } = req.params
    let post = await postsModel.getPost(post_id)
    
    if (post.length) {
        post = await c2p(post)
        res.json({
            data: post
        })
    } else {
        res.status(404).json({
            status: 404,
            message: 'not found'
        })
    }
}

const createPost = async (req, res) => {
    let { title, description} = req.body
    let { token } = req.headers
    let { user_id } = jwt.verify(token, process.env.SECRET_KEY_4JWT) 
    let user = await usersModel.getUser(user_id)
    
    if(user.length) {
        
        let newPost = await postsModel.createPost(title, description, user_id)
        
        if (newPost.length) {
            res.status(201).json({
                message: 'Post succesfully created',
                data: {
                    title: newPost[0].title,
                    description: newPost[0].description,
                    user_id: newPost[0].user_id
                }
            })
        } else {
            res.status(400).json({
                message: 'some error'
            })
        }
    }
    else {
        res.status(400).json({
            message: "you not registered"
        })
    }

}

const deletePost = async (req, res) => {
    let { post_id }  = req.params
    let { token } = req.headers

    let { user_id } = jwt.verify(token, process.env.SECRET_KEY_4JWT)
    let post = await postsModel.getPost(post_id)
    
    if((user_id && post.length) && user_id === post[0].user_id) {

        let deletedPost = await postsModel.deletePost(post_id)
    
        if( deletedPost.length ) {
            res.json({
                message: 'Post succesfully deleted'
            })
        }
    } else {
        res.json({
            message: 'You can\'t delete this post because you didn\'t write it'
        }).status(400)
    }
}

const updatePost = async (req, res) => {
    let { post_id } = req.params
    let { title, description } = req.body
    
    let { token } = req.headers

    let { user_id } = jwt.verify(token, process.env.SECRET_KEY_4JWT)
    let post = await postsModel.getPost(post_id)
  
    if((user_id && post.length) && user_id === post[0].user_id) {
        
        title = title ? title : post[0].title
        description = description ? description : post[0].description

        let updatedPost = await postsModel.updatePost(post_id, title, description)
    
        if( updatedPost.length ) {
            
            res.json({
                message: 'Post succesfully updated',
                data: updatedPost
            })
        }
    } else {
        res.json({
            message: 'You can\'t update this post because you didn\'t write it'
        }).status(400)
    }

}

module.exports = {
    getPost,
    getPosts,
    createPost,
    deletePost,
    updatePost
}