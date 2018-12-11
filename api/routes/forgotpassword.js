const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Customer = require('../models/customer');
const checkAuth = require('../middleware/check-auth');

router.post('/forgotpassword', (req, res, next) => {
    User.find({ mobile: req.body.mobile })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(409).json({
                    error: 'User does not exists',
                    responsecode: 10 // user does not exists
                });
            } else {
                return res.status(200).json({
                    error: 'User exists',
                    responsecode: 11 // user exists
                });
            }
        })
});

router.post('/reset', (req, res, next) => {
    User.find({ mobile: req.body.mobile })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(409).json({
                    error: 'User does not exists',
                    responsecode: 10 // user does not exists
                });
            } else {
                bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const id = user._id;

                        User.update({ _id: id }, {
                            $set:
                                {
                                    password: hash
                                }
                        })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'Password Updated Successfully',
                                    messagecode: 2 //2 = update
                                });
                            })
                            .catch(err => {
                                // console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/customer', (req, res, next) => {
    Customer.find({ mobile: req.body.mobile })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(409).json({
                    error: 'User does not exists',
                    responsecode: 10 // user does not exists
                });
            } else {
                return res.status(200).json({
                    error: 'User exists',
                    responsecode: 11 // user exists
                });
            }
        })
});

router.post('/customerreset', (req, res, next) => {
    Customer.find({ mobile: req.body.mobile })
        .exec()
        .then(cust => {
            if (cust.length < 1) {
                return res.status(409).json({
                    error: 'User does not exists',
                    responsecode: 10 // user does not exists
                });
            } else {
                bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const id = cust[0]._id;

                        Customer.update({ _id: id }, {
                            $set:
                                {
                                    password: hash
                                }
                        })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'Password Updated Successfully',
                                    messagecode: 2 //2 = update
                                });
                            })
                            .catch(err => {
                                // console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/updateprofile', (req, res, next) => {
    Customer.find({ mobile: req.body.mobile })
        .exec()
        .then(cust => {
            if (cust.length < 1) {
                return res.status(409).json({
                    error: 'User does not exists',
                    responsecode: 10 // user does not exists
                });
            } else {
                bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const id = cust[0]._id;

                        Customer.update({ _id: id }, {
                            $set:
                                {
                                    password: hash,
                                    username: req.body.username,
                                    email: req.body.emailid
                                }
                        })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'Profile Updated Successfully',
                                    messagecode: 2 //2 = update
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

router.post('/updateAdminprofile', (req, res, next) => {
    User.find({ mobile: req.body.mobile })
        .exec()
        .then(cust => {
            if (cust.length < 1) {
                return res.status(409).json({
                    error: 'User does not exists',
                    responsecode: 10 // user does not exists
                });
            } else {
                bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const id = cust[0]._id;

                        User.update({ _id: id }, {
                            $set:
                                {
                                    password: hash,
                                    username: req.body.username,
                                    email: req.body.emailid
                                }
                        })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'Profile Updated Successfully',
                                    messagecode: 2 //2 = update
                                });
                            })
                            .catch(err => {
                                // console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/updateonlyusernameemail', (req, res, next) => {
    Customer.find({ mobile: req.body.mobile })
        .exec()
        .then(cust => {
            const id = cust[0]._id;
            Customer.update({ _id: id }, {
                $set:
                    {
                        username: req.body.username,
                        email: req.body.emailid
                    }
            })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Profile Updated Successfully',
                        messagecode: 2 //2 = update
                    });
                })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
});

router.post('/updateonlyAdminusernameemail', (req, res, next) => {
    User.find({ mobile: req.body.mobile })
        .exec()
        .then(cust => {
            const id = cust[0]._id;
            User.update({ _id: id }, {
                $set:
                    {
                        username: req.body.username,
                        email: req.body.emailid
                    }
            })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Profile Updated Successfully',
                        messagecode: 2 //2 = update
                    });
                })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
});

module.exports = router;