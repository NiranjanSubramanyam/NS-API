const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Store = require('../models/store');
const User = require('../models/user');

//Submit api for saving a store offer
//Source = Web
//User = store user
router.post('/', (req, res, next) => {
    const id = req.body.StoreId;
    
    Store.update({ _id: id }, { $set: 
        {
            StoreOffer: req.body.StoreOffer
        }
     })
        .exec()
        .then(result => {

            res.status(200).json({
                message: 'Offer Updated for Store'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.update({ _id: id }, {
        $set:
            {
                StoreOffer: []
            }
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Store Offer Deleted Successfully',
                messagecode: '2'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//Getting stock details of logged in user based on store Id
//Source = Web
//User = Kitchen user
router.get('/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.find({
        "_id": id
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
                message: 'Offer Deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;