const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ServiceZone = require('../models/servicezone');
const Store = require('../models/store');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    if (req.body.AreaId === 0) {
        const servicingZone = new ServiceZone({
            _id: new mongoose.Types.ObjectId(),
            AreaName: req.body.AreaName,
            StoreName: req.body.StoreName,
            StoreId: req.body.StoreId,
            Status: req.body.Status
        });
        servicingZone
            .save()
            .then(result => {
                res.status(200).json({
                    message: 'Service Area Saved Successfully',
                    messagecode: '101'
                });
            })
            .catch(err => {
                // console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    } else {
        const id = req.body.AreaId;
        ServiceZone.update({ _id: id }, {
            $set:
                {
                    AreaName: req.body.AreaName,
                    StoreName: req.body.StoreName,
                    Status: req.body.Status
                }
        })
            .exec()
            .then(result => {
                //console.log(result);
                res.status(200).json({
                    message: 'Service Area Updated Successfully',
                    messagecode: '102'
                });
            })
            .catch(err => {
                //console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
});

router.get('/', (req, res, next) => {
    ServiceZone
        .find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                allZones: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/ForCustomer', (req, res, next) => {
    ServiceZone
        .find()
        .select('AreaName StoreName')
        .exec()
        .then(docs => {
            res.status(200).json({
                allZones: docs.map(doc => {
                    return {
                        AreaName: doc.AreaName,
                        StoreName: doc.StoreName
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:storeid', (req, res, next) => {
    const id = req.params.storeid;
    ServiceZone.find({
        "StoreId": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    storeServiceZones: doc
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

router.post('/UpdateServiceZone', (req, res, next) => {
    const id = req.body.areaid;

    ServiceZone.update({ _id: id }, {
        $set:
            {
                AreaName: req.body.AreaName,
                Status: req.body.Status
            }
    })
        .exec()
        .then(result => {

            console.log(result);
            res.status(200).json({
                message: 'Status Updated Successfully',
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

router.delete('/:areaid', (req, res, next) => {
    ServiceZone.remove({ _id: req.params.areaid })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Area Deleted"
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
    ServiceZone.remove()
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