const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const EmailNotification = require('../models/emailnotification');

//Submit api for saving email notifications from customers
//Source = Web
router.post('/', (req, res, next) => {
    const emailNotifications = new EmailNotification({
        _id: new mongoose.Types.ObjectId(),
        anonymousname: req.body.anonymousname,
        anonymousemail: req.body.anonymousemail,
        anonymousphone: req.body.anonymousphone,
        anonymousmessage: req.body.anonymousmessage,
        status: 'New',
        messagesentdate: new Date().toLocaleDateString()
    });

    emailNotifications
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Email Saved Successfully',
                messagecode: '1' //Email sent successfully to customer
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/update', (req, res, next) => {
    const id = req.body.notificationid;
    EmailNotification.update({ _id: id }, 
        { 
            $set: {
                status: req.body.status,
                responsemessage: req.body.responsemessage
            } 
        }
    )
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Notification updated',
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

router.get('/', (req, res, next) => {
    EmailNotification
        .find()
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    allemails: docs
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

router.delete('/:emailid', (req, res, next) => {
    const id = req.params.emailid;
    EmailNotification.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Email Notifications Deleted'
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
    EmailNotification.remove()
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