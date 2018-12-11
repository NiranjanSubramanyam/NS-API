const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Help = require('../models/help');

router.post('/', (req, res, next) => {
    const helpObject = new Help({
        _id: new mongoose.Types.ObjectId(),
        HelpTitle: req.body.HelpTitle,
        HelpContent1: req.body.HelpContent1,
        HelpContent2: req.body.HelpContent2,
        HelpContent3: req.body.HelpContent3,
        HelpContent4: req.body.HelpContent4,
        HelpContent5: req.body.HelpContent5,
        HelpContent6: req.body.HelpContent6,
        HelpAudience: req.body.HelpAudience,
        Status: req.body.Status
    });
    helpObject
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Saved Successfully',
                messagecode: '1'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

router.patch('/:helpid', (req, res, next) => {
    const id = req.params.helpid;

    Help.update({ _id: id }, {
        $set:
            {
                HelpTitle: req.body.HelpTitle,
                HelpContent1: req.body.HelpContent1,
                HelpContent2: req.body.HelpContent2,
                HelpContent3: req.body.HelpContent3,
                HelpContent4: req.body.HelpContent4,
                HelpContent5: req.body.HelpContent5,
                HelpContent6: req.body.HelpContent6,
                HelpAudience: req.body.HelpAudience,
                Status: req.body.Status
            }
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Updated',
                messagecode: '1'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/', (req, res, next) => {
    Help
        .find()
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    allhelp: docs
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

router.get('/gethelpbyaudience/:audiencename', (req, res, next) => {
    console.log(req.params.audiencename);
    const audname = req.params.audiencename;
    Help.find({
        "HelpAudience": audname
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    helpdata: doc
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.delete('/:helpid', (req, res, next) => {
    const id = req.params.helpid;
    Help.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Help Content Deleted'
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
    Help.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'All Deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;