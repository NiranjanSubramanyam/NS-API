const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const LoosePacks = require('../models/loosepack');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    const loosePack = new LoosePacks({
        _id: new mongoose.Types.ObjectId(),
        itemcode: req.body.itemcode,
        itemname: req.body.itemname,
        itemunit: req.body.itemunit,
        quantity: req.body.quantity,
        itemcategory: req.body.itemcategory,
        manufacturername: req.body.manufacturername,
        mrp: req.body.mrp,
        status: 'Active',
        createdby: req.body.userid,
        store: req.body.store,
        storename: req.body.storename,
        costprice: req.body.costprice,
        sellingprice: req.body.sellingprice,
        discount: req.body.discount,
        weight: req.body.weight
    });
    loosePack
        .save()
        .then(result => {
            res.status(200).json({
                message: 'Saved Successfully',
                messagecode: '101'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/', (req, res, next) => {
    LoosePacks
        .find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                allLoosePacks: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/loosepacksbystore/:storeid', (req, res, next) => {
    //console.log(req.params.storeid);
    const id = req.params.storeid;
    LoosePacks.find({
        "store": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    storeitems: doc
                });
            } else {
                //console.log("404");
                res.status(404).json({
                    message: 'No records found !'
                });
            }
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/update', (req, res, next) => {
    const id = req.body.looseid;

    LoosePacks.update({ _id: id }, {
        $set:
        {
            itemcode: req.body.itemcode,
            itemname: req.body.itemname,
            quantity: req.body.quantity,
            itemcategory: req.body.itemcategory,
            mrp: req.body.mrp,
            status: req.body.status,
            createdby: req.body.userid,
            costprice: req.body.costprice,
            sellingprice: req.body.sellingprice,
            discount: req.body.discount,
            weight: req.body.weight
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

router.post('/updatestatus', (req, res, next) => {
    //console.log(req.body.orderid);
    const id = req.body.looseid;

    LoosePacks.update({ _id: id }, {
        $set:
        {
            Status: req.body.Status
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

router.delete('/:looseid', (req, res, next) => {
    LoosePacks.remove({ _id: req.params.looseid })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Deleted"
            });
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//This API deletes all the records from the table
router.patch('/', (req, res, next) => {
    LoosePacks.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Loose Packs Master Deleted"
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