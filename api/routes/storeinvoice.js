const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const StoreInvoice = require('../models/storeinvoice');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    const invData = new StoreInvoice({
        _id: new mongoose.Types.ObjectId(),
        AssignAmount: req.body.AssignAmount,
        InvoiceDate: req.body.InvoiceDate,
        Store: req.body.Store,
        DueDate: req.body.DueDate,
        Collector: req.body.Collector,
        Plan: req.body.Plan
    });
    invData
        .save()
        .then(result => {
            res.status(200).json({
                message: 'Saved Successfully',
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
    StoreInvoice
        .find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                allInvoiceData: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getstoreinvoices/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    StoreInvoice.find({
        "Store": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    storeinvoices: doc
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

//This API deletes all the records from the table
router.patch('/', (req, res, next) => {
    StoreInvoice.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Deleted"
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