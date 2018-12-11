const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Customer = require('../models/customer');
const CustomerOrder = require('../models/customerorder');
const checkAuth = require('../middleware/check-auth');
const OrderLog = require('../models/orderlog');

router.post('/', (req, res, next) => {

    const custOrder = new CustomerOrder({
        _id: new mongoose.Types.ObjectId(),
        OrderNo: req.body.OrderNo,
        OrderDate: req.body.OrderDate,
        OrderedBy: req.body.OrderedBy,
        ContactNo: req.body.ContactNo,
        DeliveryDate: req.body.DeliveryDate,
        DeliveryAddress: req.body.DeliveryAddress,
        Status: req.body.Status,
        DeliveryDetail: req.body.DeliveryDetail,
        Voucher: req.body.Voucher,
        DeliveryFee: req.body.DeliveryFee,
        Store: req.body.Store,
        StoreName: req.body.StoreName,
        PaymentMode: req.body.PaymentMode,
        OrderedByName: req.body.OrderedByName,
        SpecialInstructions: req.body.SpecialInstructions,
        OrderTotal: req.body.OrderTotal
    });
    custOrder
        .save()
        .then(result => {

            let orderid = result._id;
            const cusOrder = new OrderLog({
                _id: new mongoose.Types.ObjectId(),
                CustomerOrderId: orderid
            });
        
            cusOrder
                .save()
                .then(result => {
                    res.status(201).json({
                        messagecode: '1'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

            res.status(200).json({
                message: 'Customer Order Saved Successfully',
                messagecode: '101'
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

router.get('/:customerid', (req, res, next) => {
    console.log(req.params.customerid);
    const id = req.params.customerid;
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

router.post('/UpdateOrder', (req, res, next) => {
    console.log(req.body.orderid);
    const id = req.body.orderid;

    CustomerOrder.update({ _id: id }, {
        $set:
        {
            //StoreDeliveryFee: [],
            Status: req.body.Status
        }
    })
        .exec()
        .then(result => {

            console.log(result);
            res.status(200).json({
                message: 'Status Updated Successfully',
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

//Notes added by Store Admin / Store User while processing the order will be updated here.
router.post('/addnotes', (req, res, next) => {
    console.log(req.body.orderid);
    const id = req.body.orderid;

    CustomerOrder.update({ _id: id }, {
        $set:
        {
            AdminNotes: req.body.AdminNotes
        }
    })
        .exec()
        .then(result => {

            console.log(result);
            res.status(200).json({
                message: 'Notes Added Successfully',
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

//Update all customer logs
router.post('/updatelogs', (req, res, next) => {
    console.log(req.body.orderid);
    const id = req.body.orderid;

    CustomerOrder.update({ _id: id }, {
        $set:
        {
            OrderLogs: req.body.OrderLogs
        }
    })
        .exec()
        .then(result => {

            console.log(result);
            res.status(200).json({
                message: 'Logs Updated Successfully',
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

//Delete all in DB. 
//HIGH RISK ACTION
router.delete('/', (req, res, next) => {
    CustomerOrder.remove()
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