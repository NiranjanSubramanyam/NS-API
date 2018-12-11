const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Store = require('../models/store');
const Notification = require('../models/notification');

router.get('/general/:userid', (req, res, next) => {
    const id = req.params.userid;
    Notification.find({
        "userid": id
    })
        .exec()
        .then(docs => {
            if (docs) {                
                res.status(200).json({
                    count: docs.length,
                    userNotifications: docs
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
            res.status(500).json(
                {
                    errorcode: '2'
                }
            );
        });
});

router.get('/storespecific/:storeid', (req, res, next) => {
    const id = req.params.storeid;
    Notification.find({
        "storeid": id
    })
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    storeNotifications: docs.filter(results => results.notificationstatus != '1') // 0 = new, 1 = store soft delete
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
            res.status(500).json(
                {
                    errorcode: '2'
                }
            );
        });
});

router.get('/notificationcount/:storeid', (req, res, next) => {
    const id = req.params.storeid;
    Notification.find({
        "storeid": id
    })
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length
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
            res.status(500).json(
                {
                    errorcode: '2'
                }
            );
        });
});

router.post('/', (req, res, next) => {
    const notData = new Notification({
        _id: new mongoose.Types.ObjectId(),
        notificationname: req.body.notificationname,
        notificationproductname: req.body.notificationproductname,
        notificationproductcode: req.body.notificationproductcode,
        notificationmessageheader: req.body.notificationmessageheader,
        notificationmessagebody: req.body.notificationmessagebody,
        notificationaction: req.body.notificationaction,
        notificationtype: req.body.notificationtype,
        storeid: req.body.storeid,
        userid: req.body.userid,
        notificationstatus: req.body.notificationstatus
    });
    notData
        .save()
        .then(result => {
            res.status(200).json({
                message: 'Notification Saved Successfully',
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

router.post('/:notificationid', (req, res, next) => {
    const id = req.params.notificationid;

    Notification.update({ _id: id }, {
        $set:
        {
            notificationstatus: req.body.notificationstatus
        }
    })
        .exec()
        .then(result => {
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

router.get('/', (req, res, next) => {
    Notification
        .find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                allNotificationsData: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//This will be delete from user point of view but we will be making the notification as InActive
router.patch('/delete/:notificationid', (req, res, next) => {
    const id = req.params.notificationid;

    //InActive status is virtually delete
    Notification.update({ _id: id }, {
        $set:
        {
            notificationstatus: '1' // 1 = store soft delete
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

//This will be delete from user point of view but we will be making the notification as InActive
router.patch('/deletelist/', (req, res, next) => {
    let notificationlistdata = req.body.notificationlist;
    
    notificationlistdata.forEach(element => {
        Notification.update({ _id: element._id }, {
            $set:
            {
                notificationstatus: '1' // 1 = store soft delete
            }
        })
        .exec()
    });
    //const id = req.body.notificationid;

    //InActive status is virtually delete
    // Notification.update({ _id: id }, {
    //     $set:
    //     {
    //         notificationstatus: '1' // 1 = store soft delete
    //     }
    // })
    //     .exec()
    //     .then(result => {

    //         console.log(result);
    //         res.status(200).json({
    //             message: 'Status Updated Successfully',
    //             messagecode: '1'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     });
});

//This API deletes all the records from the table
router.patch('/', (req, res, next) => {
    Notification.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: "All Notifications Deleted"
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