const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const CustomerOrder = require('../models/customerorder');
const User = require('../models/user');


//Getting order details of logged in user based on user Id
//Source = Web
//User = Store user
router.get('/:storeid', (req, res, next) => {
    const id = req.params.storeid;
    CustomerOrder.find({
        "Store": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    myorders: doc
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/', (req, res, next) => {
    CustomerOrder
        .find()
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    allorders: docs
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const id = req.body.orderid;

    CustomerOrder.update({ _id: id }, {
        $set:
        {
            Status: req.body.Status,
            DeliveryDate: req.body.DeliveryDate
        }
    })
        .exec()
        .then(result => {

            res.status(200).json({
                message: 'Order Status Updated Successfully',
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
    const id = req.params.orderid;
    CustomerOrder.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted'
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/orderdashboard/:storeid', (req, res, next) => {
    const id = req.params.storeid;

    CustomerOrder.find({
        "Store": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                this.total = 0;
                this.totalRevenueOrders = doc.filter(results => results.Status == 'Delivered');
                for (i=0; i<this.totalRevenueOrders.length; i++) {
                    this.total += Number(this.totalRevenueOrders[i].OrderTotal);
                }
                console.log(this.total);
                res.status(200).json({
                    newOrdersCount: doc.filter(results => results.Status == 'Order Placed').length,
                    pendingOrdersCount: doc.filter(results => (results.Status == 'Confirmed' || results.Status == 'Dispatched')).length,
                    totalOrdersCount: doc.filter(results => results.Status == 'Delivered').length,
                    cancelOrdersCount: doc.filter(results => results.Status == 'Cancelled').length,
                    totalRevenue: this.total
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({ error: err });
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