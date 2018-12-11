const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const InStoreOrder = require('../models/instoreorder');
const Store = require('../models/store');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    //console.log(req.body);

    const custOrder = new InStoreOrder({
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
        IsOrderModified: 0,
        ItemDetails: req.body.DeliveryDetail
    });
    custOrder
        .save()
        .then(result => {
            //console.log(result);
            res.status(200).json({
                message: 'Customer Order Saved Successfully',
                messagecode: '101'
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

router.post('/update/', (req, res, next) => {
    console.log(req.body);
    const id = req.body.orderid;

    InStoreOrder.update({ _id: id }, {
        $set:
        {
            ModifiedDate: req.body.ModifiedDate,
            ModifiedBy: req.body.ModifiedBy,
            ModifiedByName: req.body.ModifiedByName,
            OrderTotal: req.body.OrderTotal,
            Discount: req.body.Discount,
            IsOrderModified: req.body.IsOrderModified,
            ItemDetails: req.body.DeliveryDetail
        }
    })
        .exec()
        .then(result => {

            console.log(result);
            res.status(200).json({
                message: 'Order Updated Successfully',
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
    InStoreOrder.find()
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
    InStoreOrder.find({
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
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/orderbyno/:orderno', (req, res, next) => {
    //console.log(req.params.storeid);
    const id = req.params.orderno;
    InStoreOrder.find({
        "OrderNo": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    orderdata: doc
                });
            } else {
                //console.log("404");
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:userid', (req, res, next) => {
    //console.log(req.params.userid);
    const id = req.params.userid;
    InStoreOrder.find({
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
                //console.log("404");
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/UpdateOrder', (req, res, next) => {
    //console.log(req.body.orderid);
    const id = req.body.orderid;

    InStoreOrder.update({ _id: id }, {
        $set:
        {
            Status: req.body.Status
        }
    })
        .exec()
        .then(result => {

            //console.log(result);
            res.status(200).json({
                message: 'Status Updated Successfully',
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

router.get('/orderdashboard/:storeid', (req, res, next) => {
    //console.log(req.params.storeid);
    const id = req.params.storeid;

    InStoreOrder.find({
        "Store": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                this.total = 0;
                this.instoreRevenueOrders = doc.filter(results => (results.Status == 'InStore Delivered' || results.Status == 'Delivered'));
                for (i = 0; i < this.instoreRevenueOrders.length; i++) {
                    this.total += Number(this.instoreRevenueOrders[i].OrderTotal);
                }
                //console.log(this.total);
                res.status(200).json({
                    instoresales: doc.filter(results => (results.Status == 'InStore Delivered' || results.Status == 'Delivered')).length,
                    instoreRevenue: this.total
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/admindashboard/:id', (req, res, next) => {
    InStoreOrder.find()
        .exec()
        .then(doc => {
            if (doc) {
                this.total = 0;
                this.instoreRevenueOrders = doc.filter(results => (results.Status == 'InStore Delivered' || results.Status == 'Delivered'));
                for (i = 0; i < this.instoreRevenueOrders.length; i++) {
                    this.total += Number(this.instoreRevenueOrders[i].OrderTotal);
                }
                //console.log(this.total);
                res.status(200).json({
                    instoreOrders: doc.filter(results => (results.Status == 'InStore Delivered' || results.Status == 'Delivered')).length,
                    instoreRevenue: this.total
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:orderid', (req, res, next) => {
    InStoreOrder.remove({ _id: req.params.orderid })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Customer Order Deleted"
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
    InStoreOrder.remove()
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