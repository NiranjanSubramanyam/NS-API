const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Store = require('../models/store');
const User = require('../models/user');

const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './stores/');
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, Date.now() + '_' + file.originalname);
            //cb (null,  file.originalname);
        }
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }

}).single('myfile');

router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success: false, message: 'File size is too large. Max limit is 10MB' });
            } else if (err.code === 'filetype') {
                res.json({ success: false, message: 'File type is invalid. Must be .png/.jpeg/.jpg' });
            } else {
                console.log(err);
                res.json({ success: false, message: 'File was not able to be uploaded' });
            }
        } else {
            if (!req.file) {
                res.json({ success: false, message: 'No file was selected' });
            } else {
                console.log(req.file.path);
                res.json({ success: true, message: 'File was uploaded!', savedfilename: req.file.path });
            }
        }
    })
})

//Submit api for saving a store
//Source = Web
//User = store user
router.post('/', (req, res, next) => {
    if (req.body.StoreId === '0') {
        console.log("Create Operation");

        const myStore = new Store({
            _id: new mongoose.Types.ObjectId(),
            StoreName: req.body.StoreName,
            StoreIncharge: req.body.StoreIncharge,
            Branch: req.body.Branch,
            EstablishedYear: req.body.EstablishedYear,
            StorePhone1: req.body.StorePhone1,
            StorePhone2: req.body.StorePhone2,
            StoreCoordinates: req.body.StoreCoordinates,
            CanDeliver: req.body.CanDeliver,
            DeliveryRadius: req.body.DeliveryRadius,
            DeliveryFee: req.body.DeliveryFee,
            AddressLine1: req.body.AddressLine1,
            AddressLine2: req.body.AddressLine2,
            Landmark: req.body.Landmark,
            City: req.body.City,
            State: req.body.State,
            Country: req.body.Country,
            RegistrationNo: req.body.RegistrationNo,
            CertificateNo: req.body.CertificateNo,
            UserId: req.body.UserId,
            PayeeName: req.body.PayeeName,
            BankACNo: req.body.BankACNo,
            IFSCCode: req.body.IFSCCode,
            BankBranch: req.body.BankBranch,
            AccountType: req.body.AccountType,
            StoreImagePath: req.body.StoreImagePath,
            StoreTag: req.body.StoreTag,
            BankName: req.body.BankName,
            PostalCode: req.body.PostalCode,
            StoreStatus: 'Active',
            storeplan: 'trial',
            StoreUsersLimit: 3,
            StoreTimings: req.body.StoreTimings,
            StorePin: 1212
        });

        myStore
            .save()
            .then(result => {
                res.status(201).json({
                    message: 'Store Created Successfully',
                    messagecode: '1',
                    storeid: {
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
    } else {
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
                UserId: req.body.UserId,
                PayeeName: req.body.PayeeName,
                BankACNo: req.body.BankACNo,
                IFSCCode: req.body.IFSCCode,
                BankBranch: req.body.BankBranch,
                AccountType: req.body.AccountType,
                StoreImagePath: req.body.StoreImagePath,
                StoreTag: req.body.StoreTag,
                BankName: req.body.BankName,
                PostalCode: req.body.PostalCode,
                StoreStatus: req.body.StoreStatus
            }
        })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Store Updated Successfully',
                    messagecode: '1',
                    storeid: {
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

router.get('/getstoreinfo/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.find({
        "_id": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    mystore: doc
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

router.post('/UpdateStatus', (req, res, next) => {
    //console.log(req.body.orderid);
    const id = req.body.storeid;

    Store.update({ _id: id }, {
        $set:
        {
            StoreStatus: req.body.StoreStatus
        }
    })
        .exec()
        .then(result => {

            //console.log(result);
            res.status(200).json({
                message: 'Status Updated Successfully',
                messagecode: '1'
            });
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/admin/updatestore', (req, res, next) => {
    const id = req.body.storeid;

    Store.update({ _id: id }, {
        $set:
        {
            StoreIncharge: req.body.StoreIncharge,
            Branch: req.body.Branch,
            EstablishedYear: req.body.EstablishedYear,
            StorePhone1: req.body.StorePhone1,
            StorePhone2: req.body.StorePhone2,
            CanDeliver: req.body.CanDeliver,
            AddressLine1: req.body.AddressLine1,
            City: req.body.City,
            State: req.body.State,
            StoreTag: req.body.StoreTag,
            PostalCode: req.body.PostalCode
        }
    })
        .exec()
        .then(result => {

            //console.log(result);
            res.status(200).json({
                message: 'Updated Successfully',
                messagecode: '1'
            });
        })
        .catch(err => {
            //console.log(err);
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

router.post('/limitcount', (req, res, next) => {
    //console.log(req.body.orderid);
    const id = req.body.storeid;

    Store.update({ _id: id }, {
        $set:
        {
            StoreUsersLimit: req.body.limitcount
        }
    })
        .exec()
        .then(result => {

            //console.log(result);
            res.status(200).json({
                message: 'Updated Successfully',
                messagecode: '1'
            });
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/updateplan', (req, res, next) => {
    //console.log(req.body.orderid);
    const id = req.body.storeid;

    Store.update({ _id: id }, {
        $set:
        {
            storeplan: req.body.storeplan
        }
    })
        .exec()
        .then(result => {

            //console.log(result);
            res.status(200).json({
                message: 'Updated Successfully',
                messagecode: '1'
            });
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getstorepin/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.find({
        "_id": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    mystorepin: doc.map(doc => {
                        return {
                            storepin: doc.StorePin
                        }
                    })
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

router.post('/updatepin', (req, res, next) => {
    //console.log(req.body.orderid);
    const id = req.body.storeid;

    Store.update({ _id: id }, {
        $set:
        {
            StorePin: req.body.StorePin
        }
    })
        .exec()
        .then(result => {

            //console.log(result);
            res.status(200).json({
                message: 'Updated Successfully',
                messagecode: '1'
            });
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//Delete all stores in DB. 
//HIGH RISK ACTION
router.delete('/', (req, res, next) => {
    Store.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'All Stores Deleted'
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