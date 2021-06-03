const {
    User
} = require('../models/user')
const express = require('express');
const routers = express.Router();
// used to encrypt password
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
// used for creating json web tokens 
const JWT = require('jsonwebtoken');
// express http request for GET method
// use async/await for asynchronous Method
routers.get(`/`, async (req, res) => {
    const userList = await User.find().select('-password');
    if (!userList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(userList)
});



//count the users

/// Get Products count
routers.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments((count) => count)
    if (!userCount) {
        res.status(500).json({
            success: false,
            message: "Prodcut is not found"
        })
    }
    res.send({
        UserCount: userCount
    })
});



// Get User by ID 
routers.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');;
    if (!user) {
        res.status(500).json({
            success: false,
            message: "User is not found"
        })
    }
    console.log("The Selected User is " + user);
    res.send(user)
});


// Login Section
routers.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    })
    const secret = process.env.SECRET;
    if (!user) {
        return res.status(404).send("The User Email is not found !")
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        // JWT for creating a token for each user
        const token = JWT.sign({
                userID: user.id,
                isAdmin: user.isAdmin
            },
            // Generated Token ID for this user
            secret, {
                //options of tokens
                // token expires after 1 day
                expiresIn: '1d'
            }
        )

        return res.status(200).send({
            user: user.email,
            token: token
        })
    } else {
        return res.status(404).send("The Password is wrong !")
    }
})



routers.post(`/register`, (req, res) => {
    // here to push attributes data to database using POST HTTP REQUEST
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        StreetAddress: req.body.StreetAddress,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        apartment: req.body.apartment,
    })
    //save database
    // use it as Promise()
    user.save().then((userCreated) => {
        res.status(201).json(userCreated);
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
});


routers.delete(`/:id`, async (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found !"
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "user is deleted successfully !!"
            })
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: "Invalid user",
            error: err
        })
    })
})


module.exports = routers;