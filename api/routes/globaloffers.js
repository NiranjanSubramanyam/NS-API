const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const GlobalOffer = require('../models/globaloffer');
const User = require('../models/user');

//Submit api for saving a global offer
//Source = Web
//User = Store user
router.post('/', (req, res, next) => {
    const globalOffer = new GlobalOffer({
        _id: new mongoose.Types.ObjectId(),
        userid: req.body.UserId,
        couponcode: req.body.CouponCode,
        couponname: req.body.CouponName,
        offerpercent: req.body.OfferPercent,
        status: req.body.Status,
        fromdate: req.body.FromDate,
        todate: req.body.ToDate,
        offerdescription: req.body.OfferDescription
    });
    globalOffer
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Global Offer Created Successfully',
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

router.patch('/:offerId', (req, res, next) => {
    const id = req.params.offerId;

    GlobalOffer.update({ _id: id }, {
        $set:
            {
                userid: req.body.UserId,
                couponcode: req.body.CouponCode,
                couponname: req.body.CouponName,
                offerpercent: req.body.OfferPercent,
                status: req.body.Status,
                fromdate: req.body.FromDate,
                todate: req.body.ToDate,
                offerdescription: req.body.OfferDescription
            }
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Global Offer Updated'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/', (req, res, next) => {
    GlobalOffer
        .find()
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    globalOffers: docs
                });
            } else {
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:globalOfferId', (req, res, next) => {
    const id = req.params.globalOfferId;
    GlobalOffer.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Global Offer Deleted'
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
    GlobalOffer.remove()
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