const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Customer = require('../models/customer');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', (req, res, next) => {
    Customer.find({ email: req.body.email })
        .exec()
        .then(customer => {
            if (customer.length >= 1) {
                return res.status(409).json({
                    error: 'Customer exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {                        
                        const customer = new Customer({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            mobile: req.body.mobile,
                            username: req.body.username
                        });
                        customer
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
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

router.post('/login', (req, res, next) => {
    Customer.find({ mobile: req.body.mobile })
        .exec()
        .then(customer => {
            if (customer.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed1',
                    messagecode: 4 // User does not exist
                });
            }
            bcrypt.compare(req.body.password, customer[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                       message: 'Auth failed',
                       messagecode: 5 // Username or Password is incorrect
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            mobile: customer[0].mobile,
                            userId: customer[0]._id
                        },
                        'neighbourhoodstores', //json web token private key
                        {
                            expiresIn: "5h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        username: customer[0].username,
                        userId: customer[0]._id,
                        email: customer[0].email,
                        mobile: customer[0].mobile,
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth failed',
                    messagecode: 6 //Unknown error. Please contact administrator or Old password may be incorrect
                });
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/', (req, res, next) => {    
    Customer.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                customers: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:mobileno', (req, res, next) => {
    const mobile = req.params.mobileno;
    Customer.find({
        "mobile": mobile
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    customerdetails: doc
                });
            } else {
                console.log("404");
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/CustomerInfo/:CustomerId', (req, res, next) => {
    console.log(req.params.CustomerId);
    const ID = req.params.CustomerId;
    Customer.find({
        "_id": ID
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    customerdetails: doc
                });
            } else {
                console.log("404");
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:userId', (req, res, next) => {
    Customer.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Customer deleted" 
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Delete all in DB. 
//HIGH RISK ACTION
router.delete('/', (req, res, next) => {
    Customer.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'All Deleted'
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;