const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Customer = require('../models/customer');
const CustomerAddress = require('../models/customeraddress');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    if (req.body.AddressId === 0) {
        console.log("Create Operation");
        const custAddress = new CustomerAddress({
            _id: new mongoose.Types.ObjectId(),
            customer: req.body.customer,
            addresstype: req.body.addresstype,
            fullname: req.body.fullname,
            mobilenumber: req.body.mobilenumber,
            pincode: req.body.pincode,
            flathouseno: req.body.flathouseno,
            areacolony: req.body.areacolony,
            landmark: req.body.landmark,
            towncity: req.body.towncity,
            state: req.body.state,
            specialinstructions: req.body.specialinstructions
        });
        custAddress
            .save()
            .then(result => {
                res.status(201).json({
                    message: 'Customer Address Saved Successfully',
                    messagecode: '1'
                });
            })
            .catch(err => {
                // console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    } else {
        console.log("Update Operation");
        const id = req.body.AddressId;
        CustomerAddress.update({ _id: id }, {
            $set:
                {
                    customer: req.body.customer,
                    addresstype: req.body.addresstype,
                    fullname: req.body.fullname,
                    mobilenumber: req.body.mobilenumber,
                    pincode: req.body.pincode,
                    flathouseno: req.body.flathouseno,
                    areacolony: req.body.areacolony,
                    landmark: req.body.landmark,
                    towncity: req.body.towncity,
                    state: req.body.state,
                    specialinstructions: req.body.specialinstructions
                }
        })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Customer Address Updated Successfully',
                    messagecode: '1'
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

router.get('/', (req, res, next) => {
    CustomerAddress.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                customeraddresses: docs
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
    CustomerAddress.find({
        "customer": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    customeraddresses: doc
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

router.delete('/:customeraddress', (req, res, next) => {
    CustomerAddress.remove({ _id: req.params.customeraddress })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Customer Address Deleted"
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
    CustomerAddress.remove()
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