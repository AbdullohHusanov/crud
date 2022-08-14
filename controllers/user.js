const jwt = require('jsonwebtoken')
require('dotenv').config()
const usersModel = require('../models/users.model')

const getUsers = async (req, res) => {
    let users = await usersModel.getUsers()
    
    if (req.query.search) {
        let users = await usersModel.getUsersBySearch(req.query.search)
        
        if (users.length) {
            res.json({
                data: users
            })    
        } else {
            res.status(404).json({
                status: 404,
                message: 'not fount'
            })    
        }
    } else {
        
        if(users.length) {
            res.json({
                data: users
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'not fount'
            })
        }
    }

}

const getUser = async (req, res) => {
    let { user_id } = req.params
    let user = await usersModel.getUser(user_id)
    
    if (user.length) {
        res.json({
            data: user
        })
    } else {
        res.status(404).json({
            status: 404,
            message: 'not found'
        })
    }
}

const createUser = async (req, res) => {
    let { username, password, email } = req.body
    console.log('sdfgsdf');
    let newUser = await usersModel.createUser(username, password, email)

    let userToken = jwt.sign({
            username: username, 
            user_id: newUser[0].user_id
        }, process.env.SECRET_KEY_4JWT)

    res.status(201).json({
        message: 'User succesfully created',
        data: username,
        token: userToken
    })
}

const deleteUser = async (req, res) => {
    let { userId }  = req.params
    let { token } = req.headers
    
    let { user_id } = jwt.verify(token, process.env.SECRET_KEY_4JWT)
    let user = await usersModel.getUser(userId)
    
    if ((user.length && user_id) && user[0].user_id == user_id) {

        let deletedUser = await usersModel.deleteUser(user_id)
    
        if( deletedUser.length ) {
            
            res.json({
                message: 'Post succesfully deleted'
            })
        }
    } else {
        res.json({
            message: 'you can\'t delete this user, because he not you'
        })
    }
}

const updateUser = async (req, res) => {
    let { userId } = req.params
    let { username, password, email} = req.body
    let { token } = req.headers

    let { user_id } = jwt.verify(token, process.env.SECRET_KEY_4JWT)
    let user = await usersModel.getUser(userId)
    
    if((user.length && user_id) && userId == user_id) {

        username = username ? username : user[0].username
        password = password ? password : user[0].password
        email = email ? email : user[0].email
        
        let updatedUser = await usersModel.updateUser(user_id, username, password, email)
    
        res.json({
            message: 'Post succesfully updated',
            data: updatedUser
        })
    } else {
        res.json({
            message: 'you can\'t update this user, because he not you'
        })
    }

}

module.exports = {
    getUser,
    getUsers,
    createUser,
    deleteUser,
    updateUser
}