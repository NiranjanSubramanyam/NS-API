const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Store = require('../models/store');
const User = require('../models/user');

//Get Store Names and ID
router.get('/:userId', (req, res, next) => {
    console.log(req.params.userId);
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

module.exports = router;