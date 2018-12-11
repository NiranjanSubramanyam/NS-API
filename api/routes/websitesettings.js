const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const WebSiteSettings = require('../models/websitesetting');
const User = require('../models/user');

//Submit api for saving website settings
//Source = Web
//User = admin user
router.post('/', (req, res, next) => {
    if (req.body.settingsId === 0) {

        const websiteSettings = new WebSiteSettings({
            _id: new mongoose.Types.ObjectId(),
            userid: req.body.UserId,
            ApplicationName: req.body.ApplicationName,
            WebsiteUrl: req.body.WebsiteUrl,
            GoogleAnalyticsCode: req.body.GoogleAnalyticsCode,
            MetaTag1: req.body.MetaTag1,
            MetaTag2: req.body.MetaTag2,
            MetaTag3: req.body.MetaTag3,
            FacebookLink: req.body.FacebookLink,
            TwitterLink: req.body.TwitterLink,
            GooglePlusLink: req.body.GooglePlusLink,
            InstagramLink: req.body.InstagramLink,
            LinkedInLink: req.body.LinkedInLink,
            AdminEmailId: req.body.AdminEmailId,
            HelpdeskEmailId: req.body.HelpdeskEmailId,
            EscalationEmailId: req.body.EscalationEmailId,
            ContactPhone1: req.body.ContactPhone1,
            ContactPhone2: req.body.ContactPhone2,
            Address: req.body.Address,
            StateGST: req.body.StateGST,
            CentralGST: req.body.CentralGST
        });

        websiteSettings
            .save()
            .then(result => {
                res.status(201).json({
                    message: 'Website Settings Created Successfully',
                    messagecode: '1'
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    } else {
        const id = req.body.settingsId;
        WebSiteSettings.update({ _id: id }, {
            $set:
                {
                    userid: req.body.UserId,
                    ApplicationName: req.body.ApplicationName,
                    WebsiteUrl: req.body.WebsiteUrl,
                    GoogleAnalyticsCode: req.body.GoogleAnalyticsCode,
                    MetaTag1: req.body.MetaTag1,
                    MetaTag2: req.body.MetaTag2,
                    MetaTag3: req.body.MetaTag3,
                    FacebookLink: req.body.FacebookLink,
                    TwitterLink: req.body.TwitterLink,
                    GooglePlusLink: req.body.GooglePlusLink,
                    InstagramLink: req.body.InstagramLink,
                    LinkedInLink: req.body.LinkedInLink,
                    AdminEmailId: req.body.AdminEmailId,
                    HelpdeskEmailId: req.body.HelpdeskEmailId,
                    EscalationEmailId: req.body.EscalationEmailId,
                    ContactPhone1: req.body.ContactPhone1,
                    ContactPhone2: req.body.ContactPhone2,
                    Address: req.body.Address,
                    StateGST: req.body.StateGST,
                    CentralGST: req.body.CentralGST
                }
        })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Website Settings Updated Successfully',
                    messagecode: '2'
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    }
})


//Getting Store details of logged in user based on user Id
//Source = Web
//User = Store user
router.get('/:settingsId', (req, res, next) => {
    const id = req.params.settingsId;
    WebSiteSettings.find({
        "_id": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    websettings: doc
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

router.get('/', (req, res, next) => {
    WebSiteSettings
        .find()
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    websettings: docs
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

router.delete('/:settingsId', (req, res, next) => {
    const id = req.params.settingsId;
    WebSiteSettings.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Website Settings Deleted'
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
    WebSiteSettings.remove()
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