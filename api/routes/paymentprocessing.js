const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const sha512 = require('js-sha512');

const Customer = require('../models/customer');
const CustomerOrder = require('../models/customerorder');
const checkAuth = require('../middleware/check-auth');

router.post('/generatehash', (req, res, next) => {
    //calculate hash and send to web page as response
    
    var hashData = { preHashString: 'KwVqPkQc' + '|' + req.body.txnid + '|' + req.body.amount + '|' + req.body.productinfo + '|' + req.body.firstname + '|' + req.body.email + '|||||||||||' };
    var hash = sha512(hashData.preHashString + 'zcGvtxUxn3');
    
    //Yet to add exception handling
    res.status(200).json({
        message: "hash response",
        hashcode: hash
    });
});



router.post('/', (req, res, next) => {

    const custOrder = new CustomerOrder({
        _id: new mongoose.Types.ObjectId(),
        OrderNo: Date.now(),
        OrderDate: "02-06-2018",
        OrderedBy: req.body.OrderedBy,
        ContactNo: req.body.ContactNo,
        DeliveryDate: "03-06-2018",
        DeliveryAddress: req.body.DeliveryAddress,
        Status: "Created",
        DeliveryDetail: req.body.DeliveryDetail,
        Voucher: req.body.Voucher,
        DeliveryFee: req.body.DeliveryFee,
        Store: req.body.Store,
        OrderTotal: req.body.OrderTotal
    });
    custOrder
        .save()
        .then(result => {
            res.status(200).json({
                message: 'Customer Order Saved Successfully',
                messagecode: '1'
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
    CustomerOrder.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                customerOrder: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:cusorderid', (req, res, next) => {
    const id = req.params.cusorderid;
    CustomerOrder.find({
        "OrderedBy": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    customerOrder: doc
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

router.delete('/:orderid', (req, res, next) => {
    CustomerOrder.remove({ _id: req.params.orderid })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Customer Order Deleted"
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