const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Advertisement = require('../models/advertisement');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './advertisements/');
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

//Submit api for saving advertisements
//Source = Web
//User = super admin
router.post('/', (req, res, next) => {
    console.log(req.body);
    if (req.body.AdvertisementId === 0) {
        console.log("Create Operation");

        const advertisement = new Advertisement({
            _id: new mongoose.Types.ObjectId(),
            AdvertisementTag: req.body.AdvertisementTag,
            AdvertisementName: req.body.AdvertisementName,
            AdvertisementImagePath: req.body.AdvertisementImagePath,
            Status: req.body.Status,
            DisplayOrder: req.body.DisplayOrder
        });

        advertisement
            .save()
            .then(result => {
                res.status(201).json({
                    message: 'Advertisement Created Successfully',
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
        console.log("Update Operation");
        const id = req.body.AdvertisementId;
        Advertisement.update({ _id: id }, {
            $set:
                {
                    AdvertisementTag: req.body.AdvertisementTag,
                    AdvertisementName: req.body.AdvertisementName,
                    AdvertisementImagePath: req.body.AdvertisementImagePath,
                    Status: req.body.Status,
                    DisplayOrder: req.body.DisplayOrder
                }
        })
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Advertisement Updated Successfully',
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
})


router.get('/:AdvertisementId', (req, res, next) => {
    console.log(req.params.AdvertisementId);
    const id = req.params.AdvertisementId;
    Advertisement.find({
        "_id": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    selectedAdvertisement: doc
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
    Advertisement
        .find()
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    alladvertisements: docs
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

router.delete('/:AdvertisementId', (req, res, next) => {
    const id = req.params.AdvertisementId;
    Advertisement.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Advertisement Deleted'
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
    Advertisement.remove()
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