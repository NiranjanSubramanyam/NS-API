const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SKUMaster = require('../models/skumaster');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    const skuData = new SKUMaster({
        _id: new mongoose.Types.ObjectId(),
        itemlist: req.body.itemlist,
        createdby: req.body.userid
    });
    skuData
        .save()
        .then(result => {
            res.status(200).json({
                message: 'SKU Data Saved Successfully',
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

router.post("/update", (req, res, next) => {
    const id = req.body.skuid;

    SKUMaster.update(
        { _id: id },
        {
            $set: {
                itemlist: req.body.itemlist,
                createdby: req.body.userid
            }
        }
    )
        .exec()
        .then(result => {
            //console.log(result);
            res.status(200).json({
                message: "Updated",
                messagecode: 1
            });
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/', (req, res, next) => {
    SKUMaster
        .find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                allSkuData: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//This API deletes all the records from the table
router.patch('/', (req, res, next) => {
    SKUMaster.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: "SKU Master Deleted"
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/singleupdate", (req, res, next) => {  
    const id = req.body.skuid;
  
    SKUMaster.updateOne(
      {
        "_id": id,
        "itemlist.itemid": req.body.itemid
      },
      {
        "$set": {
          "itemlist.$.productcode": req.body.productcode,
          "itemlist.$.itemname": req.body.itemname,
          "itemlist.$.itemcategory": req.body.itemcategory,
          "itemlist.$.manufacturer": req.body.manufacturer,
          "itemlist.$.mrp": req.body.mrp
        }
      }
    )
      .exec()
      .then(result => {
        res.status(200).json({
          message: "SKU Updated",
          messagecode: 1
        });
      })
      .catch(err => {
        // //console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;