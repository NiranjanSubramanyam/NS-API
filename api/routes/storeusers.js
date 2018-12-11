const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const StoreUser = require('../models/storeuser');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    StoreUser.find({ mobile: req.body.mobile })
        .exec()
        .then(user => {
            console.log("Check User");
            if (user.length >= 1) {
                const id = req.body.userid;
                StoreUser.update({ _id: id }, {
                    $set:
                    {
                        email: req.body.email,
                        mobile: req.body.mobile,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,                        
                        completeaddress: req.body.completeaddress,
                        enabled: req.body.enabled,
                        comments: req.body.comments,
                        usergroup: req.body.usergroup
                    }
                })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: 'User Updated Successfully',
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
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    console.log("Create User");
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new StoreUser({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            mobile: req.body.mobile,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            storename: req.body.storename,
                            completeaddress: req.body.completeaddress,
                            candeliver: req.body.candeliver,
                            storetag: req.body.storetag,
                            enabled: 2, //0 - not yet enabled, 1 - enabled, 2 - access provided, 3 - disabled
                            usergroup: '1', // initial value: 1 for store admin
                            latitude: req.body.latitude,
                            longitude: req.body.longitude,
                            location: req.body.location,
                            registrationdate: new Date().toLocaleString(),
                            maxnoofusers: 3,
                            mainstoreadmin: 1
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created',
                                    messagecode: '1',
                                    storeuserid: {
                                        _id: result._id
                                    }
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
            }
        })
});

router.post('/createuser', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new StoreUser({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                mobile: req.body.mobile,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                enabled: 2, //0 - not yet enabled, 1 - enabled, 2 - access provided, 3 - disabled
                usergroup: req.body.usergroup, // 1 for store admin, 2 for store user
                storename: req.body.storename,
                storeid: req.body.storeid,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                location: req.body.location,
                mainstoreadmin: 2
            });
            user
                .save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created',
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
});

router.post('/updatestatus', (req, res, next) => {
    StoreUser.find({ _id: req.body.userid })
        .exec()
        .then(user => {
            const id = user[0]._id;
            StoreUser.update({ _id: id }, {
                $set:
                {
                    enabled: req.body.enabled,//status
                    usergroup: req.body.usergroup 
                }
            })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Store User Updated Successfully',
                        messagecode: 2 //2 = update
                    });
                })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
});

router.post('/update/status', (req, res, next) => {
    StoreUser.find({ _id: req.body.userid })
        .exec()
        .then(user => {
            const id = user[0]._id;
            StoreUser.update({ _id: id }, {
                $set:
                {
                    enabled: req.body.enabled
                }
            })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Status Updated Successfully',
                        messagecode: 2 //2 = update
                    });
                })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
});

router.post('/update/usergroup', (req, res, next) => {
    StoreUser.find({ _id: req.body.userid })
        .exec()
        .then(user => {
            const id = user[0]._id;
            StoreUser.update({ _id: id }, {
                $set:
                {
                    usergroup: req.body.usergroup
                }
            })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Usergroup Updated Successfully',
                        messagecode: 2 //2 = update
                    });
                })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
});

router.post('/checkexists', (req, res, next) => {
    StoreUser.find({ mobile: '91' + req.body.mobile })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(200).json({
                    error: 'User exists',
                    status: '1' //user exists
                });
            } else {
                return res.status(200).json({
                    message: 'User does not exist',
                    status: '0' //user does not exist
                });
            }
        })
});

router.post('/checkvalidpassword', (req, res, next) => {
    StoreUser.find({ _id: req.body.userid })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed. User does not exist.',
                    messagecode: 4 // User does not exist
                });
            }
            bcrypt.compare(req.body.oldpassword, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed',
                        messagecode: 5 // Password is incorrect
                    });
                }
                if (result) {
                    return res.status(200).json({
                        message: 'Auth successful',
                        messagecode: 1
                    });
                } else {
                    return res.status(200).json({
                        message: 'Auth failed',
                        messagecode: 6 // Password is incorrect
                    });
                }
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/changepassword', (req, res, next) => {
    let userid;
    StoreUser.find({ _id: req.body.userid })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(409).json({
                    error: 'User does not exists',
                    responsecode: 10 // user does not exists
                });
            } else {
                userid = user[0]._id;

                bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const id = userid;
                        StoreUser.update({ _id: id }, {
                            $set:
                            {
                                password: hash
                            }
                        })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'Password Updated Successfully',
                                    messagecode: 2 //2 = update
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/resetbymobile', (req, res, next) => {
    StoreUser.find({ mobile: req.body.mobile })
        .exec()
        .then(cust => {
            if (cust.length < 1) {
                return res.status(409).json({
                    error: 'User does not exists',
                    responsecode: 10 // user does not exists
                });
            } else {
                bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const mobileno = cust[0].mobile;
                        StoreUser.update({ mobile: mobileno }, {
                            $set:
                                {
                                    password: hash
                                }
                        })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'Password Updated Successfully',
                                    messagecode: 2 //2 = update
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
            }
        })
});

router.post('/resetpassword', (req, res, next) => {
    let userid;
    StoreUser.find({ _id: req.body.userid })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(409).json({
                    error: 'User does not exist',
                    responsecode: 10 // user does not exists
                });
            } else {
                userid = user[0]._id;

                bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const id = userid;
                        StoreUser.update({ _id: id }, {
                            $set:
                            {
                                password: hash,
                                ispasswordreset: 1
                            }
                        })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'Password Reset Successful',
                                    messagecode: 2 //2 = update
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/login', (req, res, next) => {
    StoreUser.find({ mobile: req.body.mobile })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed. User does not exist.',
                    messagecode: 4 // User does not exist
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed',
                        messagecode: 5 // Username or Password is incorrect
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            mobile: user[0].mobile,
                            userId: user[0]._id
                        },
                        'neighborhood_stores_secret_passcode_for_jwt_signing_DO_NOT_SHARE_WITH_ANYONE', //json web token private key
                        {
                            expiresIn: "24h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        firstname: user[0].firstname,
                        userId: user[0]._id,
                        mobile: user[0].mobile,
                        email: user[0].email,
                        storeid: user[0].storeid,
                        enabled: user[0].enabled,
                        usergroup: user[0].usergroup,
                        latitude: user[0].latitude,
                        longitude: user[0].longitude,
                        location: user[0].location,
                        storename: user[0].storename,
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth failed',
                    messagecode: 6 //Unknown error. Please contact administrator
                });
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
    StoreUser.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                users: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getuserinfo/:userId', (req, res, next) => {
    const id = req.params.userId;
    StoreUser.find({
        "_id": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    myuserdata: doc
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

router.get('/getstoreusers/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    StoreUser.find({
        "storeid": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    storeusers: doc
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

router.delete('/:userId', (req, res, next) => {
    StoreUser.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/updatestoreid', (req, res, next) => {
    StoreUser.find({ _id: req.body.userid })
        .exec()
        .then(user => {
            const id = user[0]._id;
            StoreUser.update({ _id: id }, {
                $set:
                {
                    storeid: req.body.storeid,
                    storename: req.body.storename
                    //enabled: req.body.enabled
                }
            })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Store User Updated Successfully',
                        messagecode: 2 //2 = update
                    });
                })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
});

router.post('/newregistration/confirm', (req, res, next) => {
    StoreUser.find({ _id: req.body.userid })
        .exec()
        .then(user => {
            const id = user[0]._id;
            StoreUser.update({ _id: id }, {
                $set:
                {
                    emailverified: req.body.emailverified,
                    mobileverified: req.body.mobileverified,
                    addressverified: req.body.addressverified,
                    enabled: req.body.enabled,
                    approveddate: new Date().toLocaleString(),
                    approvedby: req.body.approvedby
                }
            })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Updated Successfully',
                        messagecode: 2 //2 = update
                    });
                })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
});

router.get('/newregistrations', (req, res, next) => {
    StoreUser
        .find({ "enabled": 0 })
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    allNewStores: docs
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getstores/pending', (req, res, next) => {
    StoreUser
        //.find({ "enabled": 0 || 1 || 2 || 3 }) // 0 = not yet approved, 3 = disabled or rejected
        .find() // 0 = not yet approved, 3 = disabled or rejected
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    pendingStores: docs
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getstoreinfo/:storeid', (req, res, next) => {
    StoreUser
        .find(
            { 
                "storeid": req.params.storeid,
                "mainstoreadmin": 1 
            })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    selectedstoreinfo: doc
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
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
    StoreUser.remove()
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