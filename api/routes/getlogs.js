const express = require('express');
const router = express.Router();
const CustomerOrder = require('../models/customerorder');


//getting all customer order logs
router.get('/:orderid', (req, res, next) => {
    const id = req.params.orderid;
    CustomerOrder.find({
        "_id": id
    })
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    orderLogs: docs.map(doc => {
                        return {
                            OrderLogs: doc.OrderLogs
                        }
                    })
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

module.exports = router;