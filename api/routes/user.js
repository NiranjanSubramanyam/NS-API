const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    User.find({ email: req.body.Email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                const id = req.body.UserId;
                User.update({ _id: id }, {
                    $set:
                        {
                            email: req.body.Email,
                            mobile: req.body.Mobile,
                            username: req.body.UserName,
                            firstname: req.body.FirstName,
                            lastname: req.body.LastName,
                            businessname: req.body.BusinessName,
                            businessaddress: req.body.BusinessAddress,
                            status: req.body.Status,
                            usergroup: req.body.UserGroup,
                            newuser: req.body.NewUser,
                            storeid: req.body.StoreId
                        }
                })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: 'User Updated Successfully',
                            messagecode: '1'
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            } else {
                bcrypt.hash(req.body.TemporaryPassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.Email,
                            password: hash,
                            mobile: req.body.Mobile,
                            username: req.body.UserName,
                            firstname: req.body.FirstName,
                            lastname: req.body.LastName,
                            businessname: req.body.BusinessName,
                            businessaddress: req.body.BusinessAddress,
                            status: "Active",
                            usergroup: req.body.UserGroup,
                            newuser: req.body.NewUser,
                            storeid: req.body.StoreId
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created',
                                    messagecode: '1'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    error: 'User exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            mobile: req.body.mobile,
                            username: req.body.username
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created',
                                    status: '1'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/login', (req, res, next) => {
    User.find({ mobile: req.body.mobile })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed1',
                    messagecode: 4 // User does not exist
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed',
                        messagecode: 5 // Username or Password is incorrect
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            mobile: user[0].mobile,
                            userId: user[0]._id
                        },
                        'neighborhood_stores_secret_passcode_for_jwt_signing_DO_NOT_SHARE_WITH_ANYONE', //json web token private key
                        {
                            expiresIn: "24h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        username: user[0].username,
                        userId: user[0]._id,
                        storeid: user[0].storeid,
                        mobile: user[0].mobile,
                        email: user[0].email,
                        storename: user[0].businessname,
                        kitchenid: user[0].kitchenid,
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth failed',
                    messagecode: 6 //Unknown error. Please contact administrator
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                users: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/updatekitchenid', (req, res, next) => {
    User.find({ _id: req.body.userid })
        .exec()
        .then(user => {
            const id = user[0]._id;
            User.update({ _id: id }, {
                $set:
                    {
                        kitchenid: req.body.kitchenid
                    }
            })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Kitchen User Updated Successfully',
                        messagecode: 2 //2 = update
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
});

module.exports = router;