const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const TempOrder = require('../models/temporder');
const Customer = require('../models/customer');

router.post('/', (req, res, next) => {
    const tempOrder = new TempOrder({
        _id: new mongoose.Types.ObjectId(),
        orderedby: req.body.orderedby,
        cartItems: req.body.cartItems,
        uniquename: req.body.uniquename,
        tempOrderDateTime: new Date().toLocaleString()
    });
    tempOrder
        .save()
        .then(result => {
            res.status(201).json({
                messagecode: '1',
                messagekey: {
                    _id: result._id
                }
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: 2
            });
        });
});

router.patch('/:tempid', (req, res, next) => {
    const id = req.params.tempid;
    TempOrder.update({ _id: id }, {
        $set:
            {
                cartItems: req.body.cartItems,
                uniquename: req.body.uniquename
            }
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Cart Updated Successfully',
                messagecode: '2'
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
    TempOrder
        .find()
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    temporaryOrders: docs
                });
            } else {
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:secretkey', (req, res, next) => {
    const id = req.params.secretkey;
    TempOrder.find({
        "_id": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    tempOrderdetails: doc
                });
            } else {
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json(
                {
                    errorcode: '2'
                }
            );
        });
});

router.get('/getsavedorders/:userid', (req, res, next) => {
    const id = req.params.userid;
    TempOrder.find({
        "orderedby": id
    })
        .exec()
        .then(docs => {
            if (docs) {
                this.filteredResults = docs.filter(results => results.uniquename != '' && results.uniquename != null);
                //console.log("Filter Data: " + this.filteredResults);
                res.status(200).json({
                    count: docs.length,
                    savedOrderdetails: this.filteredResults
                });
            } else {
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json(
                {
                    errorcode: '2'
                }
            );
        });
});

router.delete('/:secretkey', (req, res, next) => {
    const id = req.params.secretkey;
    TempOrder.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Temp Order Deleted',
                messagecode: '501' //Temp order deleted
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
    TempOrder.remove()
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