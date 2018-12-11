const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Store = require('../models/store');
const User = require('../models/user');

//Submit api for saving a store
//Source = Web
//User = store user
router.post('/', (req, res, next) => {
    console.log("Update Operation");
        const id = req.body.StoreId;
        Store.update({ _id: id }, {
            $set:
                {
                    StoreName: req.body.StoreName,
                    StoreIncharge: req.body.StoreIncharge,
                    Branch: req.body.Branch,
                    EstablishedYear: req.body.EstablishedYear,
                    StorePhone1: req.body.StorePhone1,
                    StorePhone2: req.body.StorePhone2,
                    StoreCoordinates: req.body.StoreCoordinates,
                    CanDeliver: req.body.CanDeliver,
                    AddressLine1: req.body.AddressLine1,
                    AddressLine2: req.body.AddressLine2,
                    Landmark: req.body.Landmark,
                    City: req.body.City,
                    State: req.body.State,
                    Country: req.body.Country,
                    RegistrationNo: req.body.RegistrationNo,
                    CertificateNo: req.body.CertificateNo,
                    PayeeName: req.body.PayeeName,
                    BankACNo: req.body.BankACNo,
                    IFSCCode: req.body.IFSCCode,
                    BankBranch: req.body.BankBranch,
                    AccountType: req.body.AccountType
                }
        })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Store Updated Successfully',
                    messagecode: '1'
                });
            })
            .catch(err => {
                // console.log(err);
                res.status(500).json({
                    error: err
                });
            });
})


//Getting Store details of logged in user based on user Id
//Source = Web
//User = Store user
router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    Store.find({
        "UserId": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    mystores: doc
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
    Store
        .find()
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    allStores: docs
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

router.delete('/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Store Deleted'
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