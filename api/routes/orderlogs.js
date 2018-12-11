const express = require('express');
const router = express.Router();
const CustomerOrder = require('../models/customerorder');
const checkAuth = require("../middleware/check-auth");
const OrderLog = require('../models/orderlog');

//Update customer order logs
router.post('/updatelogs', (req, res, next) => {
    const id = req.body.orderid;

    OrderLog.update(
        { CustomerOrderId: id },
        {
          $set: {
            Logs: req.body.OrderLogs
          }
        }
      )
        .exec()
        .then(result => {
          res.status(200).json({
            message: "Logs Updated",
            messagecode: 1
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
});

//getting all customer order logs
router.get('/:orderid', (req, res, next) => {
    const id = req.params.orderid;
    OrderLog.find({
        "CustomerOrderId": id
    })
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    orderLogs: docs
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

router.get('/', (req, res, next) => {
    OrderLog.find()
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

//Delete all in DB. 
//HIGH RISK ACTION
router.delete('/', (req, res, next) => {
    OrderLog.remove()
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