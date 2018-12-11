const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const ModifiedOrder = require('../models/modifiedorder');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    //console.log(req.body);

    const custOrder = new ModifiedOrder({
        _id: new mongoose.Types.ObjectId(),
        OrderNo: req.body.OrderNo,
        OrderDate: req.body.OrderDate,
        OrderedBy: req.body.OrderedBy,
        OrderedByName: req.body.OrderedByName,
        CustomerContactNo: req.body.CustomerContactNo,
        CustomerName: req.body.CustomerName,        
        OrderTotal: req.body.OrderTotal,
        Voucher: req.body.Voucher,
        Status: req.body.Status,
        Store: req.body.Store,
        StoreName: req.body.StoreName,
        PaymentMode: req.body.PaymentMode,
        PaymentType: req.body.PaymentType,
        Discount: req.body.Discount,
        OrderMode: req.body.OrderMode,
        ModificationFlag: req.body.ModificationFlag,
        ItemDetails: req.body.DeliveryDetail
    });
    custOrder
        .save()
        .then(result => {
            //console.log(result);
            res.status(200).json({
                message: 'Saved Successfully',
                _id: result._id
            });
            //console.log("success");
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

router.get('/', (req, res, next) => {
    ModifiedOrder.find()
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

router.get('/ordersbystore/:storeid', (req, res, next) => {
    //console.log(req.params.storeid);
    const id = req.params.storeid;
    ModifiedOrder.find({
        "Store": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    allorders: doc
                });
            } else {
                //console.log("404");
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:orderno', (req, res, next) => {
    //console.log(req.params.userid);

    const id = req.params.orderno;
    ModifiedOrder.find({
        "OrderNo": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    OrderHistory: doc.filter(results => (results.ModificationFlag != 0)),
                });
            } else {
                //console.log("404");
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/UpdateOrder', (req, res, next) => {
    //console.log(req.body.orderid);
    const id = req.body.orderid;

    ModifiedOrder.update({ _id: id }, {
        $set:
        {
            ModificationFlag: req.body.ModificationFlag,
            ModifiedDate: req.body.ModifiedDate
        }
    })
        .exec()
        .then(result => {

            //console.log(result);
            res.status(200).json({
                message: 'Updated Successfully',
                messagecode: '1'
            });
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderid', (req, res, next) => {
    ModifiedOrder.remove({ _id: req.params.orderid })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Deleted"
            });
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Delete all in DB. 
//HIGH RISK ACTION
router.delete('/', (req, res, next) => {
    ModifiedOrder.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'All Deleted'
            });
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;